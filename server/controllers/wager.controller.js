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
  Wager.findOne({ _id: mongoose.Types.ObjectId('579fcdc64634360995a94092') }).exec((err, wager) => {
    if (err) {
      console.log('err: ', err);
      res.status(500).send(err);
      return;
    }
    // const tx_hexs = wager.transactions.map((tx) => { return tx.hex })
    getLinescore(wager.game_data_directory).then((data) => {
      console.log('away: ', data.away_team_runs)
      console.log('home: ', data.home_team_runs)
      const winner = parseInt(data.away_team_runs) > parseInt(data.home_team_runs) ? wager.away_pubkey : wager.home_pubkey
      if (data.status !== 'Final') { console.log('game isnt over'); res.status(200).send(err); return; }
      console.log('winner: ', winner)

      fetchWallet(['sign', winner, wager.server_pubkey]).then((results) => {
        console.log('results: ', results)
        const winner_address = results[0].winner_address;

        const output_tx = new bitcoin.TransactionBuilder();
        Promise.all(wager.transactions.map((tx) => { return txData(tx.tx_id, wager.script_address) }))
        .then((res) => {
          var amount = 0;
          for (var i = 0; i < res.length; i++) {
            var txObj = res[i];
            console.log('txObj: ', txObj)
            output_tx.addInput(txObj.tx_id, txObj.index)
            amount += parseFloat(txObj.value)
          }
          const satoshis = parseFloat(amount) * 100000000
          output_tx.addOutput(winner_address, satoshis - 5000)
          console.log('output_tx: ', output_tx)
        })
        .catch((err) => {
           console.log('err: ', err)
        })
      })

    })
  })
}
