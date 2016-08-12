#!/usr/bin/python3
import sys
import json
from os.path import expanduser
from two1.wallet import Two1Wallet
from two1.bitcoin.utils import bytes_to_str, hex_str_to_bytes
from two1.bitcoin.script import Script
from two1.bitcoin.crypto import HDPublicKey, PublicKey
from two1.bitcoin.txn import Transaction, TransactionInput, TransactionOutput

with open('{}/.two1/wallet/default_wallet.json'.format(expanduser('~'))) as data_file:
    wallet_data = json.load(data_file)

wallet = None
wallet = wallet or Two1Wallet.import_from_mnemonic(mnemonic=wallet_data['master_seed'])

def parse_input_txs(txs, script_address):
   res = []
   for tx_hex in txs:
      obj = {}
      tx = Transaction.from_hex(tx_hex)

      tx_index = tx.output_index_for_address(script_address)

      obj['tx_hash'] = tx.hash
      obj['tx_index'] = tx_index
      obj['val'] = tx.outputs[int(tx_index)].value

      res.append(obj)

   return res

# Loop through methods
del sys.argv[0]
result = None
fee = 5000

if sys.argv[0] == 'sign':
   winner_pubkey = sys.argv[1]
   redeem_script = Script.from_hex(sys.argv[2])
   txs = sys.argv[3].split(',')
   server_pubkey = sys.argv[4]

   # organize the inputs and calc the payout
   input_txs = parse_input_txs(txs, redeem_script.hash160())
   output_value = sum(int(input_tx['val']) for input_tx in input_txs)

   # create empty script
   script_sig = Script()

   # format the inputs to the payout tx
   inputs = []
   for input_tx in input_txs:
      inputs.append(TransactionInput(input_tx['tx_hash'], int(input_tx['tx_index']), script_sig, 0xffffffff))

   # format the outputs to the payout tx
   outputs = [ TransactionOutput( int(output_value - fee), Script.build_p2pkh( HDPublicKey.from_hex(winner_pubkey).hash160() )) ]

   # format the payout tx
   payout_tx = Transaction(Transaction.DEFAULT_TRANSACTION_VERSION, inputs, outputs, 0x0)

   # get servers corresponding private key and sign the inputs
   server_privkey = wallet.get_private_for_public(HDPublicKey.from_hex(server_pubkey))
   for i, inp in enumerate(payout_tx.inputs):
      payout_tx.sign_input(i, Transaction.SIG_HASH_ALL, server_privkey, redeem_script)

   print(json.dumps({ 'data': payout_tx.to_hex() }))

elif sys.argv[0] == 'create_script':
   # home and away pubkeys
   pbs = sys.argv[1].split(',')

   # create server pubkey and add it to list
   server_pubkey = wallet.get_payout_public_key().to_hex()
   pbs.append(server_pubkey)

   # format pubkeys to bytes
   pubkeys = [HDPublicKey.from_hex(pubkey).compressed_bytes for pubkey in pbs ]

   # create 2 of 3 script
   script = Script.build_multisig_redeem(2, pubkeys)

   # return address and hex of the script
   print(json.dumps({
      'server_pubkey': server_pubkey,
      'script_address': script.address(),
      'script_hex': script.to_hex()
   }))
else:
   for arg in sys.argv:
      calledOn = result or wallet
      methodToCall = getattr(calledOn, arg)
      result = methodToCall()

   print(json.dumps({ 'data': bytes_to_str(result) }))

