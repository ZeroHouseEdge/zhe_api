#!/usr/bin/python3
import sys
import json
from os.path import expanduser
from two1.wallet import Two1Wallet
from two1.bitcoin.utils import bytes_to_str

with open('{}/.two1/wallet/default_wallet.json'.format(expanduser('~'))) as data_file:
    wallet_data = json.load(data_file)

wallet = None
wallet = wallet or Two1Wallet.import_from_mnemonic(mnemonic=wallet_data['master_seed'])

# Loop through methods
del sys.argv[0]
result = None
for arg in sys.argv:
   calledOn = result or wallet
   methodToCall = getattr(calledOn, arg)
   result = methodToCall()

print(json.dumps({ 'data': bytes_to_str(result) }))



