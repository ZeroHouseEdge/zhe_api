import Wager from './models/wager';
import Transaction from './models/transaction';

export default function () {
  Wager.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    const wager1 = new Wager({
      home_id: 'xpub68rEgPGTysSZALNdFJjPyFz5TgTiABn1vrwSR1G5hzjfwBUhHJPaoCgsKviwbA8QAtVbKpddCDZ7aAyJxpFeHHt3EKTEvrNV3ewcnMMA7rg',
      author_id: 'xpub68rEgPGTysSZALNdFJjPyFz5TgTiABn1vrwSR1G5hzjfwBUhHJPaoCgsKviwbA8QAtVbKpddCDZ7aAyJxpFeHHt3EKTEvrNV3ewcnMMA7rg',
      spread: -300,
      value: 0.00735857,
      original_side: 'home',
      gameday_id: '2016_07_07_atlmlb_chnmlb_1',
      game_data_directory: '/components/game/mlb/year_2016/month_07/day_07/gid_2016_07_07_atlmlb_chnmlb_1',
      original_date: '2016/07/07',
      home_team_name: 'Cubs',
      away_team_name: 'Braves',
      home_file_code: 'chc',
      away_file_code: 'atl'
    });

    Wager.create([wager1], (error) => {
      if (!error) {
        // console.log('ready to go....');
      }
    });
  });
  // const tx1 = new Transaction({
  //   wager_id: '578d67da64393b571c3eae66',
  //   user_id: 'xpub68rEgPGTysSZALNdFJjPyFz5TgTiABn1vrwSR1G5hzjfwBUhHJPaoCgsKviwbA8QAtVbKpddCDZ7aAyJxpFeHHt3EKTEvrNV3ewcnMMA7rg',
  //   tx_id: 'b1f3ffb67dc0cae9d28e6f295e3274f70176d46d73280d4bc11a6e483b28361e',
  //   hex: '0100000005fa2441d8d46bb32b675f10d4b7c9b26a39b43f679c166bbce23211a66f193648010000006a47304402205b4ed9f4e28a2b839f4e5c93b7d478aa03a8573dbe171aa1660fd57779607bd0022006ce4da6c996a250bcc9d0667efc161f76ae35d4e43ba9e48f2d4ff9724f6125012103845b5fe09462359bc2ec1ec1c4f0836380b46ff332d1b89d99c35603c9266c24ffffffff0294b720d2781048ed59225cc0582f8913ea5fd278fff4444c607f9eae5b84a5000000006b483045022100939e0d27cf3415b7275e8fc8d2803ce4ee01c16650efd12ffbae6200ba5634380220055a1ffe140d02d38f0836c53dc8140bfb849505f7c930486450ce8b2c8b61f3012103845b5fe09462359bc2ec1ec1c4f0836380b46ff332d1b89d99c35603c9266c24ffffffffc55a10c8ee87c33f9817fef0e4f83b3663eff667a59dad85e98d70fb262d6de1000000006a47304402203e64499b44071b2951ae1eefad2a701c56ec129e078649c7a5a091e9b38ec7b502207530e93561ab9dfa9bdb12de09b2b28e702d61aa3d06e4f6edda05ef17e1b11c012103845b5fe09462359bc2ec1ec1c4f0836380b46ff332d1b89d99c35603c9266c24ffffffff0294b720d2781048ed59225cc0582f8913ea5fd278fff4444c607f9eae5b84a5010000006a47304402206cbb5b7e28a8cc9430716b179aa1019cbc5b6233e0875a8422a3c8d5849a6f71022076201fa911623a1a76e08d9ba93fdfa52d1959022e7c6e45c86cb37132bacdc301210244a35eabcdda0edfda3321ea370005760c59a3c51f32d019b9b11a07663b0ad0ffffffffc55a10c8ee87c33f9817fef0e4f83b3663eff667a59dad85e98d70fb262d6de1010000006b483045022100f1295e7ffe5e107671554059a41bea5fa5d8927decfaffead4d785523b252dda02206c3a3be480d6e2dd58aea5098fba95eb77a10a28d978db82605ce001fc8b9d2e0121037754cf62d2b66ff0fbef321a550884310a99388d665eba3c527e1c2f1be38a34ffffffff023d490b000000000017a9141d24abbe3745bbe19792d7848e644d801723cd1d875b3d2300000000001976a91421afe33eb904efecc97a888967e4348fc5248a7f88ac00000000'
  // });

  // const tx2 = new Transaction({
  //   wager_id: '578d67da64393b571c3eae66',
  //   user_id: 'xpub69Yf41CBBtivYXaGD2cPS1Mk83Z2DRLoNagjt8WhVon8RFRnbcif1SWJTWtacbfkS7HsJxM8ShjTp6oMsWEK1JyMk4WBjAoAqU3odubBMGG',
  //   tx_id: '2e16fe6a2334009cf4f856eba8a36fd2c40296c416013e1afbcbceeee17276f0',
  //   hex: '0100000002847983b1aff603af9793954f86b9fc898dae861f4c25eb81bbc23f38fdc8de39000000006a47304402207f6b53bec618e68fc6300c53c97092eb970078fd78a4f11c6f97d613b233973202203e58d71959119a68f77658bd5b8a46cc0d445f0d31de36efd98b544ccd81471e012103beeef2f35c5a3546349c78b84d91478669029988cd122d3d3c7933a24fabb5adffffffff0cdeb3a7802e32babc7f20926448b14435f872b01377e1f1abd8cd93625d663e010000006b4830450221009c867170704d14458e00d668c47312d4fa6129e0b5b579c60ba28742e921db4d02204de0b8f05e0d9b8aa4cd90393ff5400b28e6b04172ea4c86e4558e7957bd5d88012103ea01fc4329e90eefd822966aaabb430485debf0ca3591d69a8d74f024d5c2066ffffffff02298607000000000017a9141d24abbe3745bbe19792d7848e644d801723cd1d8719c30300000000001976a9149ef37b5556210bf25fae7bc6e5ac5a67ee94153488ac00000000'
  // });

  // Transaction.create([tx1, tx2], (error) => {
  //   if (!error) {
  //     console.log('ready to go....');
  //   }
  // });
}
