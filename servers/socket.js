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

        if(data.room !== 'lobby'){
            if(!gameRoomMap.has(data.room)){
                console.log('create game room map');
                let roomInfo = {
                    roomUserInfo : {}
                }

                roomInfo.roomUserInfo.host = {
                    name : data.name,
                    // stone : 'B',
                    isReady : false
                };

                gameRoomMap.set(data.room, roomInfo);
            } else {
                gameRoomMap.get(data.room).roomUserInfo.guest = {
                    name : data.name,
                    // stone : 'W',
                    isReady : false
                }
            }
            io.to(data.room).emit('enterGame', gameRoomMap.get(data.room).roomUserInfo);
        }
    });

    socket.on('leave', (data) => {
        // console.log('leaving', data);
        socket.leave(data.room);
        io.to(data.room).emit('announce', `${data.name} leaved the chat room`);
    });

    socket.on('gameLeave' , (data) => {
        if(gameRoomMap.has(data.room)){
            let roomUserInfo = gameRoomMap.get(data.room).roomUserInfo;

            // console.log('``삭제전``');
            // console.log(roomUserInfo);
            // console.log('````');

            if(data.name === roomUserInfo.host.name){
                delete roomUserInfo.host;
                roomUserInfo.host = roomUserInfo.guest;
                roomUserInfo.host.isReady = false;
                delete roomUserInfo.guest;
            } else if (data.name === roomUserInfo.guest.name){
                roomUserInfo.host.isReady = false;
                delete roomUserInfo.guest;
            }


            if(typeof roomUserInfo.host === 'undefined' && typeof roomUserInfo.guest === 'undefined' ){
                gameRoomMap.delete(data.room);
            }

            io.to(data.room).emit('changeRoomInfo', roomUserInfo);
            io.to(data.room).emit('boardInit', {});
            io.to(data.room).emit('initOmokUserInfo', roomUserInfo);
        }
    });

    socket.on('putStone', (data) => {
        io.to(data.room).emit('getBoard', data);
        io.to(data.room).emit('setGameText', data);
    })

    socket.on('shareUserStatus',(data) => {
        let roomUserInfo = gameRoomMap.get(data.room).roomUserInfo;

        roomUserInfo[data.role].isReady = data.isReady;

        io.to(data.room).emit('changeRoomInfo', roomUserInfo);
    })

    socket.on('allReady', (data) => {
        const num = Math.floor(Math.random() * 10);
        let role = num > 4 ? 'host' : 'guest';

        io.to(data.room).emit('gameStart', {
            'role' : role
        });

        io.to(data.room).emit('gameBoardStart', {
            'role' : role
        });
    })

    socket.on('endGame',(data) => {
        let roomUserInfo = gameRoomMap.get(data.room).roomUserInfo;
        roomUserInfo.host.isReady = false;
        roomUserInfo.guest.isReady = false;
        io.to(data.room).emit('boardInit', {});
        io.to(data.room).emit('initOmokUserInfo', roomUserInfo);
    })


});

server.listen(5000, function () {
    console.log('Socket IO server listening on port 5000');
});