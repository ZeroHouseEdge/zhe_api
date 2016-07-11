import Wager from '../models/wager';
// import cuid from 'cuid';
// import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

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
      res.json({ wager: saved });
   });
}
