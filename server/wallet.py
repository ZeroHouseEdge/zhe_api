#!/usr/bin/python3
import sys
import json
from os.path import expanduser
from two1.wallet import Two1Wallet
from two1.bitcoin.utils import bytes_to_str, hex_str_to_bytes
from two1.bitcoin.script import Script
from two1.bitcoin.crypto import HDPublicKey

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
   print(json.dumps({ 'pb_address': pubkey.address(), 'script_address': script.address() }))
else:
   for arg in sys.argv:
      calledOn = result or wallet
      methodToCall = getattr(calledOn, arg)
      result = methodToCall()

   print(json.dumps({ 'data': bytes_to_str(result) }))

