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
# provider = TwentyOneProvider()

history = wallet.transaction_history()
print(history)
