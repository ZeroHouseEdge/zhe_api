import io from 'socket.io';

var socketio = null;

export function main(server, done) {
   socketio = io(server);
   socketio.on('connection', (socket) => {
      return done(socket);
   });
}

export function betCreated(wager) {
   socketio.emit('bet created', { wager: wager });
   console.log('emitted betCreated');
}

export function betAccepted(wagers) {
   socketio.emit('bet accepted', { wagers: wagers });
   console.log('emitted betAccepted');
}

export function notifyAuthor(wager) {
   socketio.to(wager.author_id).emit('notify author', { wager: wager });
   console.log('emitted notifyAuthor');
}


