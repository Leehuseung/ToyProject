let server = require('http').createServer();
let io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

let gameRoomMap = new Map();

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

        io.to(data.room).emit('announce', `${data.name} entered the chat room`);

        if(!gameRoomMap.has(data.room)){
            gameRoomMap.set(socket.id , {
                room : data.room,
                role : ''
            });
            gameRoomMap.set(data.room,{
                'roomUserInfo':{
                    'host' : {
                        name : '',
                        stone : 'B',
                        isReady : false
                    },
                    'guest' : {
                        name : '',
                        stone : 'W',
                        isReady : false
                    },
                }
            });
        }
        socket.emit('enterGame', io.sockets.adapter.rooms.get(data.room).size);
    });

    socket.on('leave', (data) => {
        console.log('leaving', data);
        socket.leave(data.room);
        io.to(data.room).emit('announce', `${data.name} leaved the chat room`);
    });

    socket.on('gameLeave' , (data) => {
        let roomUserInfo = gameRoomMap.get(data.room).roomUserInfo;
        roomUserInfo[data.role].name = '';
        roomUserInfo[data.role].ready = false;
        io.to(data.room).emit('changeReady', roomUserInfo);
    });

    socket.on('putStone', (data) => {
        io.to(data.room).emit('getBoard', data);
    })

    socket.on('emitRoomUserInfo',(data) => {
        gameRoomMap.get(data.room).roomUserInfo = data.roomUserInfo;
    })

    socket.on('shareUserStatus',(data) => {
        let room = data.room;
        let roomUserInfo = gameRoomMap.get(room).roomUserInfo;

        roomUserInfo[data.role] = data.roomUserInfo;
        io.to(room).emit('changeReady', roomUserInfo);
    })

});

server.listen(5000, function () {
    console.log('Socket IO server listening on port 5000');
});