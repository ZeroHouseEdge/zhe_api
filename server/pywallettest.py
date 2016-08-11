#!/usr/bin/python3
import sys
import json
import base58
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

pubkeys = []
pbs = [
   "0488b21e03756d4a010000000a1a073557135bca6d3d4339e79ce81144c28c7127183231453970cbe2f1007c58030d83af99bc4c53270cbf7fea2b0c53703c14fff09f390244a75af743093d885d",
   "0488b21e03b6fd816f00000004a315611f9398d02e9a5f022067ca6892fb3cfef4e1cf6c6d9a83c11e530857a702181fddc3a46ce99c479eb83e3b4e52ea8ffb2def7997eeca6dfd424165bbce03",
   "0488b21e03756d4a010000000a1a073557135bca6d3d4339e79ce81144c28c7127183231453970cbe2f1007c58030d83af99bc4c53270cbf7fea2b0c53703c14fff09f390244a75af743093d885d"
]


# for pb_hex in pbs:
#    x = HDPublicKey.from_hex(pb_hex)
#    print(x.address())
#    pubkeys.append(x)
pubkey = HDPublicKey.from_hex(pbs[0])
privkey = wallet.get_private_for_public(pubkey)

# print(base58.)
# print(pubkeys)
# script = Script.build_multisig_redeem(2, pubkeys)
# print(json.dumps({ 'msg': script.address() }))

