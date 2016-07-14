import io from 'socket.io';

var socketio = null;
var socket = null;

export function main(server) {
   socketio = io(server);
   socketio.on('connection', (s) => {
      socket = s;
      socket.emit('connected', { msg: 'Socket connected to server' });
      socket.on('register user', (user) => {
         console.log('register user: ', user);
         socket.join(user);
      });
   });
};

export function betCreated(wager) {
   console.log('here at betCreated');
   socket.broadcast.emit('bet created', { wager: wager });
   // socketio.emit('bet created', { wager: wager });
   console.log('emitted betCreated');
}
