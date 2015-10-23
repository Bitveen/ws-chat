(function() {
    function Chat() {
        this.ws = new WebSocket('ws://localhost:8181');

        this.messageInput = document.getElementById('messageInput');
        this.messagesContainer = document.getElementById('messagesContainer');        

        var wsPromise = new Promise(function(resolve, reject) {
            this.ws.addEventListener('open', function(event) {
                resolve();
            }, false);
            this.ws.addEventListener('error', function(event) {
                reject(new Error('Ошибка при подключении к серверу!'));
            }, false);
        }.bind(this));

        wsPromise.then(function() {
            this.ws.addEventListener('message', this.handleMessageReceive.bind(this), false);            
            var messageForm = document.getElementById('messageForm');
            messageForm.addEventListener('submit', this.handleSubmitForm.bind(this), false);
        }.bind(this)).catch(function(err) {
            console.error(err.toString());
        });

    }


    Chat.prototype.handleSubmitForm = function(event) {
        event.preventDefault();
        var message = this.messageInput.value;
        this.ws.send(message);
        this.messageInput.value = "";
    };


    Chat.prototype.handleMessageReceive = function(event) {
        var socket = event.target;
        if (socket.readyState === WebSocket.OPEN) {
            var message = JSON.parse(event.data);
            this.messagesContainer.innerHTML += "<div>" + message.message + "</div>";
        }
    };



    new Chat();
})();

