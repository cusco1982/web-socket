import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import configure from './routers';

const app = express();
const port = process.env.PORT || 3000;


function onSocketPreError(e: Error) {
    console.log(e);
}

function onSocketPostError(e: Error) {
    console.log(e);
}


configure(app);

console.log(`Attempting to run server on port ${port}`);

const s = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// const wss = new WebSocketServer({ server: s });

// upgrade manually - own authentication - instantiate multiple websocket servers on same HTTP client
const wss = new WebSocketServer({ noServer: true });


s.on('upgrade', (req, socket, head) => {

    socket.on('error', onSocketPreError);

    // from web - use cookies // mobile-app then pass auth token up the route & parse
    // perform auth
    if (!!req.headers['BadAth']) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }


    wss.handleUpgrade(req, socket, head, (ws) => {
        socket.removeListener('error', onSocketPreError);
        wss.emit('connection', ws, req);
    })

});



wss.on('connection', (ws, req) => {

    ws.on('error', onSocketPostError);

    
    ws.on('message', (msg, isBinary) => {
        wss.clients.forEach((client) => {
            // if (client !== ws && client.readyState === WebSocket.OPEN) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg, { binary: isBinary });
            }
        })
    })


    ws.on('close', () => {
        console.log('Connection closed');
    })


});