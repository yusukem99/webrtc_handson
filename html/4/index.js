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
    // データチャネルを作成する
    const channel_label = 'chat';
    const dataChannelOptions = {
        ordered: false,
        negotiated: true,
        id: 0
    };
    channel_chat = peerConnection.createDataChannel(channel_label, dataChannelOptions);
    console.log('channel_chat', channel_chat);
    channel_chat.onopen = function (event) {
        console.log('onopen', event);
    };
    channel_chat.onmessage = function (event) {
        console.log('onmessage', event);
        document.getElementById('chatOutput').textContent += event.data + '\n';
    };
    peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
            sendSignalingData({ 'ice': event.candidate });
        }
    };
    document.getElementById('createOfferButton').addEventListener('click', createOffer);
    document.getElementById('sendDataButton').addEventListener('click', sendData);
}

async function createOffer() {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    sendSignalingData({ offer });
}

async function setRemoteOffer(offer) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    createAnswer();
}

async function createAnswer() {
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    sendSignalingData({ 'answer': answer });
}

async function setRemoteAnswer(answer) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

function sendData() {
    if (channel_chat.readyState === 'open') {
        const message = document.getElementById('chatInput').value;
        channel_chat.send(message);
        console.log('データを送信しました', message);
        document.getElementById('chatInput').value = '';
    }
}

function sendSignalingData(data) {
    websocket.send(JSON.stringify(data));
}

async function handleSignalingData(event) {
    // const data = JSON.parse(event.data);
    // もしevent.dataがblobの場合は、以下のようにしてblobを読み込む
    if (event.data instanceof Blob) {
        let text = await event.data.text();
        const data = JSON.parse(text);
        console.log('Received data:', data);
        if (data.offer) {
            setRemoteOffer(data.offer);
        } else if (data.answer) {
            setRemoteAnswer(data.answer);
        } else if (data.ice) {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.ice));
        }
    } else {
        console.log('Received data:', event.data);
    }
}