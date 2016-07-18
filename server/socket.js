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
   return;
}

export function betAccepted(wagers) {
   socketio.emit('bet accepted', { wagers: wagers });
   console.log('emitted betAccepted');
   return;
}

export function notifyAuthor(wager) {
   socketio.to(wager.author_id).emit('notify author', { wager: wager });
   console.log('emitted notifyAuthor');
   return;
}

export function payToScript(wager) {
   const bettors = [wager.author_id, wager.acceptor_id];
   for (var i=0; i < bettors.length; i++) {
      socketio.to(bettors[i]).emit('pay to script', { wager: wager });
      console.log('emitted payToScript: ', bettors[i]);
   }
   return;
}


