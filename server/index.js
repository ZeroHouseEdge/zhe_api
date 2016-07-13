import http from 'http';
import express from 'express';
import io from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';
import db from './db';
import middleware from './middleware';
import api from './api';
import * as socketjs from './socket';

var app = express();
app.server = http.createServer(app);

// 3rd party middleware
app.use(cors({
	exposedHeaders: ['Link']
}));

app.use(bodyParser.json({
	limit : '100kb'
}));

socketjs.main(app.server);

// connect to db
db( () => {

	// internal middleware
	app.use(middleware());

	// api router
	app.use('/api', api());

	app.server.listen(config.port);

	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
