// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'ws'.... Remove this comment to see the full error message
import WebSocket from 'ws';

export var wss = null;

export function listen(port: any) {
  wss = new WebSocket.Server({ port, path: '/test' });

  // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
  wss.on('connection', (ws: any) => {
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });
  });

  return wss;
}

// Keepalive in case clients lose connection during a long rule test.
// If client doesn't respond in 10s this will close the socket and 
// therefore stop the elastalert test from continuing to run detached.
setInterval(() => {
  // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
  wss.clients.forEach((ws: any) => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping(() => {});
  });
}, 10000);
