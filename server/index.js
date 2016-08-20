import http from 'http';
import express from 'express';
import io from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import sass from 'node-sass';
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

socketjs.main(app.server, (socket) => {
   socket.on('register user', (user) => {
      console.log('register user: ', user);
      socket.join(user);
   });
});

// connect to db
db( () => {

   // internal middleware
   app.use(middleware());

   // api router
   app.use(express.static(__dirname + '/public'));

   // routes to serve the static HTML files
   const html_dir = __dirname + '/public/';
   app.get('/', function(req, res) {
       res.sendfile(html_dir + 'home.html');
   });

   // API Routes
   app.use('/api', api());

   app.server.listen(config.port);

   console.log(`Started on port ${app.server.address().port}`);
});

export default app;
