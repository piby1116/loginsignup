document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    const qrCodeContainer = document.getElementById('qrcodeImage');
    const qrCodeText = 'https://givernance.kro.kr/signUpMobile.html';

    function generateQRCode(text) {
        console.log("Generating QR code with text:", text);
        if (!qrCodeContainer) {
            console.error('QR code container not found!');
            return;
        }
        try {
            new QRCode(qrCodeContainer, {
                text: text,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
            });
            console.log('QR code generated!');
        } catch (error) {
            console.error("Error generating QR code:", error);
        }
    }

    generateQRCode(qrCodeText);

    const ws = new WebSocket('wss://givernance.kro.kr:8443/');

    ws.onopen = function () {
        console.log('WebSocket connection established');
    };

    ws.onmessage = function (event) {
        console.log('Message from server: ' + event.data);
        let receivedMessages = JSON.parse(localStorage.getItem('receivedMessages')) || [];
        receivedMessages.push(event.data);
        localStorage.setItem('receivedMessages', JSON.stringify(receivedMessages));
        updateReceivedMessages();
    };

    function updateReceivedMessages() {
        const receivedMessages = JSON.parse(localStorage.getItem('receivedMessages')) || [];
        const receivedMessagesDiv = document.getElementById('receivedMessages');
        receivedMessagesDiv.innerHTML = '';
        receivedMessages.forEach((msg, index) => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${index + 1}: ${msg}`;
            receivedMessagesDiv.appendChild(messageElement);
        });
    }

    window.addEventListener('storage', function (e) {
        if (e.key === 'savedDescriptor') {
            console.log('New savedDescriptor received:', e.newValue);
            ws.send(e.newValue);
        }
    });
});

