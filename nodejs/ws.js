const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 18080 });

wss.on('connection', function connection(ws, req) {
    // console.log('connected', req);
    // sec-websocket-keyを取得
    console.log('connected', req.headers['sec-websocket-key']);

    ws.on('message', function incoming(message) {
        const string = message.toString();
        console.log(`received: ${string}`);

        // メッセージを全クライアントにブロードキャスト
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});
