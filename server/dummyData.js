import Wager from './models/wager';

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
}
