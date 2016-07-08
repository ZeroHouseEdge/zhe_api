import { Router } from 'express';
import facets from './facets';
import wager from './wager';
import * as WagerController from '../controllers/wager.controller';

export default function() {
	var api = Router();

	// mount the facets resource
	api.use('/facets', facets);

	// mount the wagers resource
	// api.use('/wagers', wager);
	api.get('/wagers/open', WagerController.getOpenWagers);

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({
			version : '1.0'
		});
	});

	return api;
}
