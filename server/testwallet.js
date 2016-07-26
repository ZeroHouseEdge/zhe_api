import { fetchWallet } from './wallet';
import Wager from './models/wager';

console.log('yoyoyo')
Wager.findOne({}).exec((err, wager) => {
   console.log('err: ', err)
   console.log('wager: ', wager)
});

