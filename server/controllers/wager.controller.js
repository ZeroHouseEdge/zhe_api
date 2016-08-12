import mongoose from 'mongoose';
import app from '../index';
import Wager from '../models/wager';
import { betCreated, betAccepted, notifyAuthor, payToScript, transactionAdded } from '../socket';
import { fetchWallet } from '../wallet';
import sanitizeHtml from 'sanitize-html';
import bitcoin from 'bitcoinjs-lib';
import { buildRedeemScript, getScriptAddress, txData } from '../bitcoin_helper';
import { getLinescore } from '../mlb';

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
  fetchWallet(['create_script', [ req.body.home_pubkey, req.body.away_pubkey ] ]).then((results) => {
    const script_data = results[0];
    req.body.server_pubkey = script_data.server_pubkey;
    req.body.script_hex = script_data.script_hex;
    req.body.script_address = script_data.script_address;
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
  })
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
  Wager.findOne({ _id: mongoose.Types.ObjectId('57ad4938153bdea645c38245') }).exec((err, wager) => {
    if (err) {
      console.log('err: ', err);
      res.status(500).send(err);
      return;
    }
    getLinescore(wager.game_data_directory).then((data) => {
      console.log('away: ', data.away_team_runs)
      console.log('home: ', data.home_team_runs)
      const winner = parseInt(data.away_team_runs) > parseInt(data.home_team_runs) ? wager.away_pubkey : wager.home_pubkey
      if (data.status !== 'Final') { console.log('game isnt over'); res.status(200).send(err); return; }
      console.log('winner: ', winner)

      fetchWallet([ 'sign', winner, wager.script_hex, wager.transactions.map((tx) => { return tx.hex }), wager.server_pubkey ]).then((results) => {
        console.log('results: ', results)
        const payout_hex = results[0].data;
      })
    })
  })
}
