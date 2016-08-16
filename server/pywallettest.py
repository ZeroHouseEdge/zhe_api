#!/usr/bin/python3
import sys
import json
import base58
import requests
from os.path import expanduser
import two1.bitcoin as bitcoin
from two1.wallet import Two1Wallet
from two1.bitcoin.utils import bytes_to_str, hex_str_to_bytes
from two1.bitcoin.script import Script
from two1.bitcoin.crypto import HDPublicKey, PublicKey
from two1.bitcoin.txn import Transaction, TransactionInput, TransactionOutput
from two1.commands.util.currency import Price
from two1.blockchain.twentyone_provider import TwentyOneProvider

with open('{}/.two1/wallet/default_wallet.json'.format(expanduser('~'))) as data_file:
    wallet_data = json.load(data_file)

wallet = None
wallet = wallet or Two1Wallet.import_from_mnemonic(mnemonic=wallet_data['master_seed'])
provider = TwentyOneProvider()

# Collect public keys
p1_pubkey = wallet.get_payout_public_key()
p2_pubkey = wallet.get_change_public_key()

# Build multisig redeem script
public_keys = [p1_pubkey.compressed_bytes, p2_pubkey.compressed_bytes]
redeem_script = bitcoin.Script.build_multisig_redeem(2, public_keys)
# Build deposit transaction (pays to the redeem script above)
# deposit_tx = wallet.build_signed_transaction({redeem_script.address(): 25000}, fees=5000)[0]
deposit_tx_obj = wallet.send_to(redeem_script.address(), 20000, False, 5000, [])
deposit_tx = deposit_tx_obj[0]['txn']

print("deposit: {}".format(deposit_tx_obj))
print("deposit 0: {}".format(deposit_tx_obj[0]))
print("Deposit hex: {}\n".format(deposit_tx.to_hex()))

# Build payment transaction
deposit_utxo_index = deposit_tx.output_index_for_address(redeem_script.hash160())

# Build unsigned payment transaction with a placeholder script
script_sig = bitcoin.Script()
print("script_sig: {}".format(script_sig))
print("script_sig type: {}".format(type(script_sig)))

inputs = [bitcoin.TransactionInput(deposit_tx.hash, deposit_utxo_index, script_sig, 0xffffffff)]
outputs = [bitcoin.TransactionOutput(15000, bitcoin.Script.build_p2pkh(p1_pubkey.hash160()))]
payment_tx = bitcoin.Transaction(bitcoin.Transaction.DEFAULT_TRANSACTION_VERSION, inputs, outputs, 0x0)

# Sign payment transaction with pubkey 1
public_key = bitcoin.PublicKey.from_bytes(redeem_script.extract_multisig_redeem_info()['public_keys'][0])
private_key = wallet.get_private_for_public(public_key)


for i, inp in enumerate(payment_tx.inputs):
   payment_tx.sign_input(i, bitcoin.Transaction.SIG_HASH_ALL, private_key, redeem_script)

# Sign payment transaction with pubkey 2
public_key = bitcoin.PublicKey.from_bytes(redeem_script.extract_multisig_redeem_info()['public_keys'][1])
private_key = wallet.get_private_for_public(public_key)

for i, inp in enumerate(payment_tx.inputs):
   payment_tx.sign_input(i, bitcoin.Transaction.SIG_HASH_ALL, private_key, redeem_script)

print("Payment: {}".format(payment_tx.to_hex()))

txid = provider.broadcast_transaction(payment_tx.to_hex())
print("txid: {}".format(txid))
