let peerConnection;
let channel_chat;
let websocket;

window.onload = async function () {
    websocket = new WebSocket('ws://localhost:18080'); // WebSocketサーバーのアドレス
    websocket.onmessage = handleSignalingData;
    websocket.onopen = () => console.log('Connected to WebSocket server');

    let configuration = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302'
            }
        ]
    };
    peerConnection = new RTCPeerConnection(configuration);

    peerConnection.ondatachannel = function (event) {
        console.log('ondatachannel', event);
        const channel = event.channel;
        channel.onopen = function (event) {
            console.log('Data channel is open');
        };
        channel.onmessage = function (event) {
            console.log('Received message', event.data);
            document.getElementById('chatOutput').textContent += event.data + '\n';
        };
    }

    peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
            sendSignalingData({ 'ice': event.candidate });
        }
    };

    document.getElementById('createOfferButton').addEventListener('click', createOffer);
    document.getElementById('setOfferButton').addEventListener('click', setRemoteOffer);
    document.getElementById('createAnswerButton').addEventListener('click', createAnswer);
    document.getElementById('setAnswerButton').addEventListener('click', setRemoteAnswer);
    document.getElementById('sendDataButton').addEventListener('click', sendData);

    channel_chat = peerConnection.createDataChannel('chat');
    channel_chat.onopen = () => console.log('Chat channel opened');
    channel_chat.onmessage = (event) => console.log('Received message:', event.data);
}

async function createOffer() {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    sendSignalingData({ 'offer': offer });
}

async function setRemoteOffer() {
    const offer = JSON.parse(document.getElementById('remoteOfferSdpTextarea').value);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    createAnswer();
}

async function createAnswer() {
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    sendSignalingData({ 'answer': answer });
}

async function setRemoteAnswer() {
    const answer = JSON.parse(document.getElementById('remoteAnswerSdpTextarea').value);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

function sendData() {
    const message = document.getElementById('chatInput').value;
    channel_chat.send(message);
    console.log('Sent message:', message);
    document.getElementById('chatInput').value = '';
}

function sendSignalingData(data) {
    websocket.send(JSON.stringify(data));
}

function handleSignalingData(event) {
    const data = JSON.parse(event.data);
    if (data.offer) {
        document.getElementById('remoteOfferSdpTextarea').value = JSON.stringify(data.offer);
        setRemoteOffer();
    } else if (data.answer) {
        document.getElementById('remoteAnswerSdpTextarea').value = JSON.stringify(data.answer);
        setRemoteAnswer();
    } else if (data.ice) {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.ice));
    }
}