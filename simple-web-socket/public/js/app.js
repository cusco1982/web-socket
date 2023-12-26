"use strict";
(function () {
    let ws;
    const messages = document.getElementById('messages');
    const wsOpen = document.getElementById('ws-open');
    const wsClose = document.getElementById('ws-close');
    const wsSend = document.getElementById('ws-send');
    const wsInput = document.getElementById('ws-input');
    function showMessage(message) {
        if (!message) {
            return;
        }
        messages.textContent += `${message}\n`;
        messages.scrollTop = messages === null || messages === void 0 ? void 0 : messages.scrollHeight;
    }
    function closeConnection() {
        if (!!ws) {
            ws.close();
        }
    }
    wsOpen.addEventListener('click', () => {
        closeConnection();
        // if had encryption then wss
        // ws = new WebSocket('wss://localhost:3000');
        ws = new WebSocket('ws://localhost:3000');
        ws.addEventListener('error', () => {
            showMessage('WebSocket error');
        });
        ws.addEventListener('open', () => {
            showMessage('WebSocket connection established');
        });
        ws.addEventListener('close', () => {
            showMessage('WebSocket connection closed');
        });
        ws.addEventListener('message', (msg) => {
            showMessage(`Received message: ${msg.data}`);
        });
    });
    wsClose.addEventListener('click', closeConnection);
    wsSend.addEventListener('click', () => {
        const val = wsInput === null || wsInput === void 0 ? void 0 : wsInput.value;
        if (!val) {
            return;
        }
        else if (!ws) {
            showMessage('No WebSocket connection');
            return;
        }
        ws.send(val);
        showMessage(`Sent "${val}"`);
        wsInput.value = '';
    });
})();
