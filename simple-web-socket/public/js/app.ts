(function () {

    let ws: WebSocket;


    const messages = <HTMLElement>document.getElementById('messages');
    const wsOpen = <HTMLElement>document.getElementById('ws-open');
    const wsClose = <HTMLElement>document.getElementById('ws-close');
    const wsSend = <HTMLElement>document.getElementById('ws-send');
    const wsInput = <HTMLInputElement>document.getElementById('ws-input');

    function showMessage(message: string) {

        if (!message) {
            return;
        }

        messages.textContent += `${message}\n`;
        messages.scrollTop = messages?.scrollHeight;
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
        })

        ws.addEventListener('open', () => {
            showMessage('WebSocket connection established');
        })

        ws.addEventListener('close', () => {
            showMessage('WebSocket connection closed');
        })

        ws.addEventListener('message', (msg: MessageEvent<string>) => {
            showMessage(`Received message: ${msg.data}`);
        })
    });



    wsClose.addEventListener('click', closeConnection);


    wsSend.addEventListener('click', () => {
        const val = wsInput?.value;

        if (!val) {
            return;
        } else if (!ws) {
            showMessage('No WebSocket connection');
            return;
        }


        ws.send(val);
        showMessage(`Send "${val}"`);

    })




})();