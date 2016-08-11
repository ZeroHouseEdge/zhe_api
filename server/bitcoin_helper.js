import bitcoin from 'bitcoinjs-lib';
import blockexplorer from './blockexplorer';

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

export function txData(txid, address) {
   return blockexplorer.getTx(txid)
   .then((res) => {
      const outputs = res.vout;
      const result = {};
      for (var i = 0; i < outputs.length; i++) {
         var output = outputs[i];
         if (output.scriptPubKey.addresses[0] === address) {
            result.index = output.n;
            result.value = output.value;
            result.tx_id = txid;
            break;
         }
      }
      return result;
   })
   .catch((err) => {
      console.log('err: ', err)
   })
}
