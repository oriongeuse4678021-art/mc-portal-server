const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('MC Portal Server Running!');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('マイクラが接続しました！');
  
  ws.on('message', (message) => {
    console.log('受信:', message);
    ws.send(JSON.stringify({
      body: { statusCode: 0 },
      header: { messagePurpose: 'commandResponse' }
    }));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`サーバー起動中: ${PORT}`);
});
