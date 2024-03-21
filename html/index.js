// 変数の宣言
let peerConnection;
let localStream = new MediaStream();
let remoteStream = new MediaStream();
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
        maxPacketLifeTime: null,
        maxRetransmits: null,
        negotiated: true,
        id: 0
    };
    channel_chat = peerConnection.createDataChannel(channel_label, dataChannelOptions);
    channel_chat.onopen = function (event) {
        console.log('chat.onopen', event);
    };
    channel_chat.onmessage = function (event) {
        console.log('chat.onmessage', event);
    }
    // データチャンネルが作成されたら実行される
    peerConnection.ondatachannel = function (event) {
        console.log('ondatachannel', event);
        const channel = event.channel;
        channel.onopen = function (event) {
            console.log('onopen', event);
        };
        channel.onmessage = function (event) {
            console.log('onmessage', event);
        };
    }
    peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
            console.log('onicecandidate', event.candidate);
        } else {
            console.log('onicecandidate', 'empty');
            const offer = peerConnection.localDescription;
            console.log('オファーを作成しました(Vanilla)', offer);
        }
    };
    // 映像が取得できたら実行される
    peerConnection.ontrack = function (event) {
        const track = event.track;
        // remoteStreamにトラックを追加する
        remoteStream.addTrack(track);
    };


    // getusermediaで映像を取得する
    // localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    // Webカメラ以外にディスプレイの映像を取得することもできる
    localStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

    // 映像を送信するためのトラックを取得する
    const videoTrack = localStream.getVideoTracks()[0];
    // 音声を送信するためのトラックを取得する
    const audioTrack = localStream.getAudioTracks()[0];

    // 映像トラックを追加する
    if (videoTrack && videoTrack.readyState === 'live') {
        peerConnection.addTrack(videoTrack, localStream);
    }
    if (audioTrack && audioTrack.readyState === 'live') {
        peerConnection.addTrack(audioTrack, localStream);
    }

    // transceiverを使ってトラックを追加する方式
    // const video_transceiver = peerConnection.addTransceiver(videoTrack);
    // const audio_transceiver = peerConnection.addTransceiver(audioTrack);
    // audio_transceiver.direction = 'recvonly';
    // console.log('オーディオトランシーバーを追加しました', audio_transceiver);

    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = localStream;
    const remoteVideo = document.getElementById('remoteVideo');
    remoteVideo.srcObject = remoteStream;
    document.getElementById('createOfferButton').addEventListener('click', createOffer);
    document.getElementById('setOfferButton').addEventListener('click', setRemoteOffer);
    document.getElementById('createAnswerButton').addEventListener('click', createAnswer);
    document.getElementById('setAnswerButton').addEventListener('click', setRemoteAnswer);
    document.getElementById('sendDataButton').addEventListener('click', sendData);
}

async function createOffer() {
    // オファーを作成する
    const offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
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
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
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