const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('OK');
});

const wss = new WebSocket.Server({ 
  server,
  handleProtocols: () => 'com.microsoft.minecraft.wsencrypt'
});

wss.on('connection', (ws, req) => {
  console.log('接続されました！', req.headers);

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      console.log('受信:', JSON.stringify(msg));

      ws.send(JSON.stringify({
        body: { statusCode: 0 },
        header: {
          messagePurpose: 'commandResponse',
          requestId: msg.header?.requestId || '',
          version: 1
        }
      }));
    } catch(e) {
      console.log('エラー:', e);
    }
  });

  ws.on('close', (code, reason) => console.log('切断:', code, reason.toString()));
  ws.on('error', (e) => console.log('エラー:', e));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('起動中:', PORT);
});
