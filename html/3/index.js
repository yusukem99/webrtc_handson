// 変数の宣言
let peerConnection;
let channel_chat;

// ドキュメントが読み込まれたら実行される　onload
window.onload = async function () {
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
            console.log('onicecandidate', event.candidate);
        } else {
            console.log('onicecandidate', 'empty');
            const offer = peerConnection.localDescription;
            console.log('オファーを作成しました(Vanilla)', offer);
        }
    };

    document.getElementById('createOfferButton').addEventListener('click', createOffer);
    document.getElementById('setOfferButton').addEventListener('click', setRemoteOffer);
    document.getElementById('createAnswerButton').addEventListener('click', createAnswer);
    document.getElementById('setAnswerButton').addEventListener('click', setRemoteAnswer);
    document.getElementById('sendDataButton').addEventListener('click', sendData);
}

async function createOffer() {
    // オファーを作成する
    const offerOptions = {
        offerToReceiveAudio: 0,
        offerToReceiveVideo: 0
    };
    const offer = await peerConnection.createOffer(offerOptions);
    console.log('オファーを作成しました(Trickle)', offer);
    await peerConnection.setLocalDescription(offer);
    console.log('オファーをセットしました');
}

async function setRemoteOffer() {
    // オファーをセットする
    const offer = document.getElementById('remoteOfferSdpTextarea').value;
    await peerConnection.setRemoteDescription(new RTCSessionDescription({
        type: 'offer',
        sdp: offer
    }));
    console.log('オファーをセットしました');
}

async function setRemoteAnswer() {
    // アンサーをセットする
    const answer = document.getElementById('remoteAnswerSdpTextarea').value;
    await peerConnection.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: answer
    }));
    console.log('アンサーをセットしました');
}

async function createAnswer() {
    // アンサーを作成する
    const answerOptions = {
        offerToReceiveAudio: 0,
        offerToReceiveVideo: 0
    };
    const answer = await peerConnection.createAnswer(answerOptions);
    console.log('アンサーを作成しました(Trickle)', answer);
    await peerConnection.setLocalDescription(answer);
    console.log('アンサーをセットしました');
}

async function sendData() {
    if (channel_chat.readyState === 'open') {
        const message = document.getElementById('chatInput').value;
        channel_chat.send(message);
        console.log('データを送信しました', message);
        document.getElementById('chatInput').value = '';
    }
}