const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('MC Portal Server Running!');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('マイクラが接続しました！');

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      console.log('受信:', JSON.stringify(msg));

      ws.send(JSON.stringify({
        body: { statusCode: 0 },
        header: {
          messagePurpose: 'commandResponse',
          requestId: msg.header?.requestId || '00000000-0000-0000-0000-000000000000',
          version: 1
        }
      }));
    } catch(e) {
      console.log('エラー:', e);
    }
  });

  ws.on('close', () => {
    console.log('切断されました');
  });

  ws.on('error', (err) => {
    console.log('WSエラー:', err);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`サーバー起動中: ${PORT}`);
});
