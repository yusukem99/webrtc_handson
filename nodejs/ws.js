const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 18080 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        // メッセージを全クライアントにブロードキャスト
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});
