import bitcoin from 'bitcoinjs-lib';
import { txData } from './bitcoin_helper';

// const pubkeys = [
//    "0488b21e03756d4a010000000a1a073557135bca6d3d4339e79ce81144c28c7127183231453970cbe2f1007c58030d83af99bc4c53270cbf7fea2b0c53703c14fff09f390244a75af743093d885d",
//    "0488b21e03b6fd816f00000004a315611f9398d02e9a5f022067ca6892fb3cfef4e1cf6c6d9a83c11e530857a702181fddc3a46ce99c479eb83e3b4e52ea8ffb2def7997eeca6dfd424165bbce03",
//    "0488b21e03756d4a010000000a1a073557135bca6d3d4339e79ce81144c28c7127183231453970cbe2f1007c58030d83af99bc4c53270cbf7fea2b0c53703c14fff09f390244a75af743093d885d"
// ].map((hex) => {
//    return new Buffer(hex, 'hex')
// });

// const redeemScript = bitcoin.script.multisigOutput(2, pubkeys)
// const scriptPubKey = bitcoin.script.scriptHashOutput(bitcoin.crypto.hash160(redeemScript))
// const address = bitcoin.address.fromOutputScript(scriptPubKey)

// const txs = [
//    {
//       "hex" : "01000000018b7d6de2f1507ba137277071cefc3a7b30cb67a6da6e40d8796be9352795cb63000000006a473044022070cc617206b4e39d07d9990efc4b3532e4925db87be9d480508386133ea717f102207700e77a8a0fbee65faf3b19cd8fd0e528d3973c189f0b25a415f5933e185d5e012102b70b1d7dcfdd9f7abc9288c81fad73f180523e30da905f752fd37c7ea7ab5625ffffffff02cf156d00000000001976a91413d4d6710d2ea85d6555b3d1bb95699afac6291f88ac867b02000000000017a914a8ea344d31f3ca1ffc8f119f379f32a04c60acae8700000000",
//       "tx_id" : "48c60820bf17b7f57d65762406fbe5a5481eef2726d0ff5b3f12357679b0ca58",
//       "user_id" : "xpub68rEgPGTysSZALNdFJjPyFz5TgTiABn1vrwSR1G5hzjfwBUhHJPaoCgsKviwbA8QAtVbKpddCDZ7aAyJxpFeHHt3EKTEvrNV3ewcnMMA7rg"
//    },
//    {
//       "hex" : "01000000012b360c00d345df164d0a2c4fd19fe5b8025bead6006023ff6f974dbc20d094a0010000006a473044022064d981e86c9f142e8a0d3e8b65d68c8fc1665f31c42ce37b5ebbf916e91508d902201b859498f136a9ccecdb62b98c49bcb8fb830860209691df438fc73d493b6498012102f094bc8729c5029fb05d2388fde805dded14cab4b6606ccc5afbef5414b35585ffffffff02867b02000000000017a914a8ea344d31f3ca1ffc8f119f379f32a04c60acae8713b54b00000000001976a9140a25f5ae98be5225b0a520b300aadf57a4045fae88ac00000000",
//       "tx_id" : "486720b3745ef6874ec23d0ecee7df13b6f50f8dfe28dc8b585e5ee23f0378d2",
//       "user_id" : "xpub69Yf41CBBtivYXaGD2cPS1Mk83Z2DRLoNagjt8WhVon8RFRnbcif1SWJTWtacbfkS7HsJxM8ShjTp6oMsWEK1JyMk4WBjAoAqU3odubBMGG"
//    }
// ]

// var output_tx = new bitcoin.TransactionBuilder()
// Promise.all(txs.map((tx) => { return txData(tx.tx_id, address) }))
// .then((res) => {
//    var value = 0;
//    for (var i = 0; i < res.length; i++) {
//       var txObj = res[i];
//       console.log('txObj: ', txObj)
//       output_tx.addInput(txObj.tx_id, txObj.index)
//       value += parseFloat(txObj.value)
//    }
//    output_tx.addOutput('03de1e179bf961821b7e83d55ffaef4f56a8701a7b7615f1e3bf28cb5f11720cce', value)
//    console.log('output_tx: ', output_tx)
// })
// .catch((err) => {
//    console.log('err: ', err)
// })

var keyPair = bitcoin.ECPair.fromWIF('xprv9yXUe99pykM8YFtYXNf9opuWsXaC2vjgm9X4PydSqxWzoqp8u58AE3pDehg2urn5qyq63QHennKAz1pi6VDJnB9fsaLivccgjCn5P2eXSrT')
console.log(keyPair)



