import fetch from 'isomorphic-fetch';

export function getTx(txid) {
   const URL = `https://blockexplorer.com/api/tx/${txid}`;

   return fetch(URL)
   .then(response => response.json().then(json => ({ json, response })))
   .then(({ json, response }) => {
      if (!response.ok) {
         return Promise.reject(json);
      }

      return json;
   })
   .then(
      response => response,
      error => error
   );
}

module.exports = {
   getTx: getTx
}
