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

export function betCreated(user) {
   console.log('here at betCreated');
   socketio.sockets.in(user).emit('bet created', { msg: 'yay a bet was created by a user', user: user });
   console.log('emitted betCreated');
}
