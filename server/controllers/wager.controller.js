import app from '../index';
import Wager from '../models/wager';
import { betCreated, betAccepted, notifyAuthor, payToScript } from '../socket';
import { fetchWallet } from '../wallet';
import sanitizeHtml from 'sanitize-html';
import bitcoin from 'bitcoinjs-lib';

/**
 * Save a post
 * @param req
 * @param res
 * @returns void
 */

 function openWagers(done) {
  Wager.find({ acceptor_id: null }).sort({ dateAdded: -1 }).exec((err, wagers) => {
    if (err) {
      return done(err, null);
    }
    return done(null, wagers)
  });
 }

export function getUserWagers(req, res) {
  Wager.find({ $or: [ { author_id: req.params.id }, { acceptor_id: req.params.id } ] }).sort({ dateAdded: -1 }).exec((err, wagers) => {
    if (err) {
       res.status(500).send(err);
    }
    res.json({ wagers: wagers });
  });
}

export function getOpenWagers(req, res) {
  openWagers((err, wagers) => {
    if (err) {
       res.status(500).send(err);
    }
    res.json({ wagers: wagers });
  });
}

export function createWager(req, res) {
   const newWager = new Wager(req.body);
   newWager.save((err, saved) => {
      if (err) {
         res.status(500).send(err);
      }
      betCreated(saved);
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

      openWagers((err, wagers) => {
        if (err) {
          res.status(500).send(err);
        }
        betAccepted(wagers);
        notifyAuthor(wager);
        payToScript(wager);
        res.json({ wagers: wagers });
      })
    });
  });
}
