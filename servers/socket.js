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

                let roomInfo = {
                    roomUserInfo : {},
                    boardHistory : []
                }

                roomInfo.roomUserInfo.host = {
                    name : data.name,
                    isReady : false
                };

                gameRoomMap.set(data.room, roomInfo);
            } else {
                if(typeof gameRoomMap.get(data.room).roomUserInfo.guest === 'undefined'){
                    gameRoomMap.get(data.room).roomUserInfo.guest = {
                        name : data.name,
                        isReady : false
                    }
                }
            }
            io.to(data.room).emit('changeRoomInfo', gameRoomMap.get(data.room).roomUserInfo);
        }
    });

    socket.on('leave', (data) => {
        socket.leave(data.room);
        io.to(data.room).emit('announce', `${data.name} leaved the chat room`);
    });

    socket.on('gameLeave' , (data) => {
        if(gameRoomMap.has(data.room)){
            let roomUserInfo = gameRoomMap.get(data.room).roomUserInfo;

            if(data.name === roomUserInfo.host.name){
                delete roomUserInfo.host;
                if(typeof roomUserInfo.guest !== 'undefined'){
                    roomUserInfo.host = roomUserInfo.guest;
                    roomUserInfo.host.isReady = false;
                    delete roomUserInfo.guest;
                }
            } else if (data.name === roomUserInfo.guest.name){
                roomUserInfo.host.isReady = false;
                delete roomUserInfo.guest;
            }

            if(typeof roomUserInfo.host === 'undefined' && typeof roomUserInfo.guest === 'undefined' ){
                gameRoomMap.delete(data.room);
            }
            io.to(data.room).emit('clearTimeout',{});
            io.to(data.room).emit('changeRoomInfo', roomUserInfo);
            io.to(data.room).emit('boardInit', {});
            io.to(data.room).emit('initOmokUserInfo', roomUserInfo);
        }
    });

    socket.on('putStone', (data) => {
        let boardHistory = gameRoomMap.get(data.room).boardHistory;
        if(boardHistory.length > 0){
            let x = boardHistory[boardHistory.length-1].x;
            let y = boardHistory[boardHistory.length-1].y;
            data.boardArr[y][x].isNew = false;
        }
        boardHistory.push({
            x : data.x,
            y : data.y
        });
        io.to(data.room).emit('clearTimeout',{});
        io.to(data.room).emit('getBoard', data);
        io.to(data.room).emit('setGameText', data);
    })

    socket.on('shareUserStatus',(data) => {
        let roomUserInfo = gameRoomMap.get(data.room).roomUserInfo;

        roomUserInfo[data.role].isReady = data.isReady;

        io.to(data.room).emit('changeRoomInfo', roomUserInfo);
    })

    socket.on('allReady', (data) => {
        if(data.role === 'host'){
            const num = Math.floor(Math.random() * 10);
            let role = num > 4 ? 'host' : 'guest';

            io.to(data.room).emit('gameStart', {
                'role' : role
            });

            io.to(data.room).emit('gameBoardStart', {
                'role' : role
            });
        }
    });

    socket.on('endGame',(data) => {
        let roomUserInfo = gameRoomMap.get(data.room).roomUserInfo;
        roomUserInfo.host.isReady = false;
        if(typeof roomUserInfo.guest !== 'undefined'){
            roomUserInfo.guest.isReady = false;
        }

        io.to(data.room).emit('clearTimeout');
        io.to(data.room).emit('boardInit', {});
        io.to(data.room).emit('initOmokUserInfo', roomUserInfo);
    })


});

server.listen(5000, function () {
    console.log('Socket IO server listening on port 5000');
});