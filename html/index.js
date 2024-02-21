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
            /*
                第二回の授業
            */
            const offer = peerConnection.localDescription;
            console.log('オファーを作成しました(Vanilla)', offer);
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

    /*
        第二回の授業
    */

    // 映像トラックを追加する
    // peerConnection.addTrack(videoTrack, stream);
    const video_transceiver = peerConnection.addTransceiver(videoTrack);
    console.log('ビデオトランシーバーを追加しました', video_transceiver);

    // 音声トラックを追加する
    // peerConnection.addTrack(audioTrack, stream);
    const audio_transceiver = peerConnection.addTransceiver(audioTrack);
    audio_transceiver.direction = 'recvonly';
    console.log('オーディオトランシーバーを追加しました', audio_transceiver);

    // オファーを作成する
    const offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
    };
    const offer = await peerConnection.createOffer(offerOptions);
    document.getElementById('offerSdpTextarea').value = offer.sdp;
    document.getElementById('copySdpButton').addEventListener('click', async function () {
        await navigator.clipboard.writeText(peerConnection.localDescription.sdp);
        console.log('クリップボードにコピーしました');
    });

    console.log('オファーを作成しました(Trickle)', offer);

    // オファーをセットする
    await peerConnection.setLocalDescription(offer);
    console.log('オファーをセットしました', offer);
}
