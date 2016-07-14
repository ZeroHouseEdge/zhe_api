import { fetchWallet } from './wallet';

fetchWallet(['get_payout_public_key', '__bytes__']).then((results) => {
   console.log('results: ', results);
});
