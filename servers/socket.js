
module.exports = () => {
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
            socket.emit('setTurn',io.sockets.adapter.rooms.get(data.room).size);
        });

        socket.on('leave', (data) => {
            console.log('leaving', data);
            socket.leave(data.room);
            io.to(data.room).emit('announce', `${data.name} leaved the chat room`);
        });

        socket.on('putStone', (data) => {
            io.to(data.room).emit('getBoard', data);
        });

        // 접속한 클라이언트의 정보가 수신되면
        // socket.on('login', function(data) {
        //     console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

        // socket에 클라이언트 정보를 저장한다
        // socket.name = data.name;
        // socket.userid = data.userid;

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        //     io.emit('login', data.name );
        // });

        // 클라이언트로부터의 메시지가 수신되면
        // socket.on('chat', function(data) {
        //     console.log('message   : ' + data);
        // console.log('Message from %s: %s', socket.name, data.msg);

        // var msg = {
        //     from: {
        //         name: socket.name,
        //         userid: socket.userid
        //     },
        //     msg: data.msg
        // };

        // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
        // socket.broadcast.emit('chat', msg);

        // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
        // socket.emit('s2c chat', msg);

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        // io.emit('s2c chat', msg);

        // 특정 클라이언트에게만 메시지를 전송한다
        // io.to(id).emit('s2c chat', data);
        // });

        // force client disconnect from server
        // socket.on('forceDisconnect', function() {
        //     socket.disconnect();
        // })

    });

    server.listen(5000, function () {
        console.log('Socket IO server listening on port 5000');
    });

};
