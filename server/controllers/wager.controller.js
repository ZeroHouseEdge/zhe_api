import Wager from '../models/wager';
// import cuid from 'cuid';
// import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all posts
 * @param req
 * @param res
 * @returns void
 */
export function getOpenWagers(req, res) {
  Wager.find({ acceptor_id: null }).exec((err, wagers) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ wagers });
  });
}
