import mongoose from 'mongoose';
import app from '../index';
import Wager from '../models/wager';
import { betCreated, betAccepted, notifyAuthor, payToScript, transactionAdded } from '../socket';
import { fetchWallet } from '../wallet';
import sanitizeHtml from 'sanitize-html';
import bitcoin from 'bitcoinjs-lib';
import { buildRedeemScript, getScriptAddress } from '../bitcoin_helper';

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
    const server_pubkey = results[0].data
    req.body.server_pubkey = server_pubkey;
    // ORDER: HOME, AWAY, SERVER
    const script = buildRedeemScript(2, [ req.body.home_pubkey, req.body.away_pubkey, req.body.server_pubkey ])
    const address = getScriptAddress(script)
    req.body.script_hex = script.toString('hex');
    req.body.script_address = address;
    Wager.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, wager) => {
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
        res.json({ wager: wager, wagers: wagers });
      })
    });
  });
}

export function addTransaction(req, res) {
  console.log('req.body: ', req.body)
  Wager.findOneAndUpdate({ _id: req.params.id }, { '$push': { transactions: req.body } }, { new: true }, (err, wager) => {
    if (err) {
      console.log('err: ', err)
      res.status(500).send(err);
    }
    console.log('wager: ', wager)
    transactionAdded(wager)
    res.json({ wager: wager });
  })
}

export function signWager(req, res) {
  Wager.findOne({ _id: mongoose.Types.ObjectId('579a82632eaaae9e77a90752') }).exec((err, wager) => {
    if (err) {
      console.log('err: ', err);
      res.status(500).send(err);
      return;
    }
    const tx_hexs = wager.transactions.map((tx) => { return tx.hex })
    fetchWallet(['sign', wager.script_hex, wager.server_pubkey, tx_hexs]).then((results) => {
      console.log('results: ', results)
      res.status(200).send(err);
    })
  })
}
