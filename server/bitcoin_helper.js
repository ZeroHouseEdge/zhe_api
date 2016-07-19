import bitcoin from 'bitcoinjs-lib';

export function buildRedeemScript(n, pubkeys) {
   const keys = pubkeys.map((hex) => {
      return new Buffer(hex, 'hex')
   });
   const redeemScript = bitcoin.script.multisigOutput(n, keys)
   return redeemScript;
}

export function getScriptAddress(redeemScript) {
   const scriptPubKey = bitcoin.script.scriptHashOutput(bitcoin.crypto.hash160(redeemScript))
   const address = bitcoin.address.fromOutputScript(scriptPubKey)
   return address;
}
