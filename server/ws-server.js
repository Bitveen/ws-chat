var uuid = require('node-uuid');
var redisClient = redis.createClient();
var Server = new require('ws').Server;
var wsServer = new Server({ port: 8181 });

var clients = [];
var clientsMessages = [];
var clientsCount = 0;

wsServer.on('connection', function(socket) {
    var newUuid = uuid.v4();
    console.log('Client ' + newUuid + ' connected');
    clientsCount++;

    /* Показать все сообщения для вновь подключившегося клиента */
    clientsMessages.forEach(function(message) {
        socket.send(JSON.stringify({
            message: message.message,
        }));
    });

    notifyClients('Пользователь User' + clientsCount + ' присоединился к чату.');

    clients.push({
        login: 'User' + clientsCount,
        id: newUuid,
        socket: socket
    });
    
    socket.on('message', function(message) {

        var clientLogin;

        for (var i = 0; i < clients.length; i++) {
            if (this === clients[i].socket) {
                clientLogin = clients[i].login;
            }
        }

        var messageData = {
            message: 'Пользователь ' + clientLogin + ' написал: ' + message,
        };

        clientsMessages.push(messageData);

        /* Уведомить все подключенные клиенты о новом сообщении */
        for (var i = 0; i < clients.length; i++) {
            clients[i].socket.send(JSON.stringify(messageData));
        }
    });
    
    socket.on('close', function() {
        var disconnectedClientLogin;
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].socket === this) {
                console.log('Client ' + clients[i].id + ' disconnected');
                disconnectedClientLogin = clients[i].login;
                clients.splice(i, 1);
                clientsCount--;
                break;
            }
        }
        notifyClients('Пользователь ' + disconnectedClientLogin + ' отключился от чата.');
    });
});


function notifyClients(message) {
    for (var i = 0; i < clients.length; i++) {
        clients[i].socket.send(JSON.stringify({
            message: message
        }));
    }
}
