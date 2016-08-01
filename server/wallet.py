#!/usr/bin/python3
import sys
import json
from os.path import expanduser
from two1.wallet import Two1Wallet
from two1.bitcoin.utils import bytes_to_str, hex_str_to_bytes
from two1.bitcoin.script import Script
from two1.bitcoin.crypto import HDPublicKey
from two1.bitcoin.txn import Transaction, TransactionInput, TransactionOutput

with open('{}/.two1/wallet/default_wallet.json'.format(expanduser('~'))) as data_file:
    wallet_data = json.load(data_file)

wallet = None
wallet = wallet or Two1Wallet.import_from_mnemonic(mnemonic=wallet_data['master_seed'])

# Loop through methods
del sys.argv[0]
result = None

if sys.argv[0] == 'sign':
   script = Script.from_hex(sys.argv[1])
   pubkey = HDPublicKey.from_hex(sys.argv[2])
   tx_hexs = sys.argv[3].split(',')

   output_value = 0
   input_txs = []
   for tx_hex in tx_hexs:
      tx_obj = {}
      tx = Transaction.from_hex(tx_hex)
      tx_index = tx.output_index_for_address(script.address())

      tx_obj['tx'] = tx
      tx_obj['tx_hex'] = tx_hex
      tx_obj['tx_index'] = tx_index
      tx_obj['val'] = tx.outputs[int(tx_index)].value
      output_value = output_value + tx_obj['val']
      input_txs.append(tx_obj)

   script_sig = Script()
   inputs = []
   for input_tx in input_txs:
      inputs.append(TransactionInput(input_tx['tx'].hash, int(input_tx['tx_index']), script_sig, 0xffffffff))

   fee = 5000
   output_price = output_value - fee
   # outputs = [TransactionOutput(int(output_price), Script.build_p2pkh(HDPublicKey.from_bytes(winner).hash160()))]

   # payment_tx = bitcoin.Transaction(bitcoin.Transaction.DEFAULT_TRANSACTION_VERSION, inputs, outputs, 0x0)
   # server_priv_key = wallet_helper.get_priv_for_pub(wager.server_pubkey)
   print(json.dumps({
      'pb_address': pubkey.address(),
      'script_address': script.address(),
      'output_price': output_price
   }))
else:
   for arg in sys.argv:
      calledOn = result or wallet
      methodToCall = getattr(calledOn, arg)
      result = methodToCall()

   print(json.dumps({ 'data': bytes_to_str(result) }))

