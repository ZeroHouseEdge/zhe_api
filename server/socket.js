import io from 'socket.io';

var socketio = null;

export function main(server, done) {
   socketio = io(server);
   socketio.on('connection', (socket) => {
      return done(socket);
   });
}

export function betCreated(socket, wager) {
   console.log('here at betCreated');
   socketio.emit('bet created', { wager: wager });
   console.log('emitted betCreated');
}
