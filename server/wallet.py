#!/usr/bin/python3
import sys
import json
from os.path import expanduser
from two1.wallet import Two1Wallet
from two1.bitcoin.utils import bytes_to_str
from two1.bitcoin.script import Script

with open('{}/.two1/wallet/default_wallet.json'.format(expanduser('~'))) as data_file:
    wallet_data = json.load(data_file)

wallet = None
wallet = wallet or Two1Wallet.import_from_mnemonic(mnemonic=wallet_data['master_seed'])

# Loop through methods
del sys.argv[0]
result = None

if sys.argv[0] == 'sign':
   del sys.argv[0]
   pubkey = sys.argv[0]
else:
   for arg in sys.argv:
      calledOn = result or wallet
      methodToCall = getattr(calledOn, arg)
      result = methodToCall()

   print(json.dumps({ 'data': bytes_to_str(result) }))

# pubkeys = [
#    "0491bba2510912a5bd37da1fb5b1673010e43d2c6d812c514e91bfa9f2eb129e1c183329db55bd868e209aac2fbc02cb33d98fe74bf23f0c235d6126b1d8334f86",
#    "04865c40293a680cb9c020e7b1e106d8c1916d3cef99aa431a56d253e69256dac09ef122b1a986818a7cb624532f062c1d1f8722084861c5c3291ccffef4ec6874",
#    "048d2455d2403e08708fc1f556002f1b6cd83f992d085097f9974ab08a28838f07896fbab08f39495e15fa6fad6edbfb1e754e35fa1c7844c41f322a1863d46213"
# ]

# serialized_pubkeys = [bytes.fromhex(p) for p in pubkeys]

# redeem_script = Script.build_multisig_redeem(2, serialized_pubkeys)

# print(redeem_script.to_hex())
