import resource from 'resource-router-middleware';
import Wager from '../models/wager';

export default resource({

   /** Property name to store preloaded entity on `request`. */
   id : 'wager',

   /** POST / - Create a new entity */
   create({ body }, res) {
      console.log("body: ", body);
      // body.id = facets.length.toString(36);
      // facets.push(body);
      // res.json(body);
      res.sendStatus(500);
   },
});
