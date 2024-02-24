// ドキュメントが読み込まれたら実行される　onload
window.onload = async function () {
    let configuration = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302'
            }
        ]
    };
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
            console.log('onicecandidate', event.candidate);
        } else {
            console.log('onicecandidate', 'empty');
        }
    };
    console.log('ドキュメントの読み込みが完了しました');
    const videotag = document.getElementById('localVideo');
    // getusermediaで映像を取得する
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });
    videotag.srcObject = stream;

    // 映像を送信するためのトラックを取得する
    const videoTrack = stream.getVideoTracks()[0];
    // 音声を送信するためのトラックを取得する
    const audioTrack = stream.getAudioTracks()[0];
}
