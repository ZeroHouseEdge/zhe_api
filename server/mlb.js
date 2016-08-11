import fetch from 'isomorphic-fetch';

export function getLinescore(game_data_directory) {
   const URL = `http://www.mlb.com/gdcross${game_data_directory}/linescore.json`;
   return fetch(URL)
   .then((res) => {
      return res.json();
   }).then((json) => {
      return json.data.game;
   });
}
