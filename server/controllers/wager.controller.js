import app from '../index';
import Wager from '../models/wager';
import { betCreated } from '../socket';
import { fetchWallet } from '../wallet';
import sanitizeHtml from 'sanitize-html';
import bitcoin from 'bitcoinjs-lib';

/**
 * Save a post
 * @param req
 * @param res
 * @returns void
 */

export function getOpenWagers(req, res) {
  Wager.find({ acceptor_id: null }).sort({ dateAdded: -1 }).exec((err, wagers) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ wagers });
  });
}

export function createWager(req, res) {
   const newWager = new Wager(req.body);
   newWager.save((err, saved) => {
      if (err) {
         res.status(500).send(err);
      }
      betCreated(app.socket, saved);
      res.json({ wager: saved });
   });
}

export function acceptWager(req, res) {
  fetchWallet(['get_payout_public_key', '__bytes__']).then((results) => {
    req.body.server_pubkey = results[0].data;
    Wager.findOneAndUpdate({ _id: req.params.id }, req.body, (err, wager) => {
      if (err) {
        res.status(500).send(err);
      }

      getOpenWagers(req, res);
    });
  });
}
