let server = require('http').createServer();
let io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', function (socket) {
    socket.on('chat', function (data) {
        console.log('chat', data);
        io.to(data.room).emit('res', {name: data.name, message: data.message});
    });

    socket.on('game', function (data) {
        console.log('game', data);
        io.to('game').emit('res', {name: 'aa'});
    });

    socket.on('disconnect', function () {
        console.log('user disconnected: ' + socket.name);
    });

    socket.on('join', (data) => {
        socket.join(data.room);
        //console.log('room : '+data.room+"    count : "+ io.sockets.adapter.rooms.get(data.room).size);
        io.to(data.room).emit('announce', `${data.name} entered the chat room`);
        socket.emit('setTurn', io.sockets.adapter.rooms.get(data.room).size);
    });

    socket.on('leave', (data) => {
        console.log('leaving', data);
        socket.leave(data.room);
        io.to(data.room).emit('announce', `${data.name} leaved the chat room`);
    });

    socket.on('putStone', (data) => {
        io.to(data.room).emit('getBoard', data);
    });
});

server.listen(5000, function () {
    console.log('Socket IO server listening on port 5000');
});
