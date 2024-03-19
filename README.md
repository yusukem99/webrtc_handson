# WebRTCハンズオン

## はじめに

WebRTCを使ってビデオチャットを実装するハンズオンです。実装を通じてWebRTCの基本的な概念を学びます。

## 開発環境

- Windows 11
- [WSL2](https://docs.microsoft.com/ja-jp/windows/wsl/install)
- Ubuntu 20.04
- Docker / Docker Compose
- Node.js v16.20.2(lts/gallium)

## npmパッケージのインストール

```bash
npm install
```

## セットアップ方法

`docker-compose.yaml`を使って、Apacheコンテナを起動します。

```bash
docker-compose up
```

`html`フォルダがドキュメントルートになっているので`http://localhost:8080`にアクセスすると最新のコードが表示されます。

過去のハンズオンは`html`ディレクトリ配下の`【番号】`のディレクトリに格納されています。

## 学習目標

- WebRTCのスタックが説明できる
- シグナリングを説明できる
- STUNの仕組みが説明できる
- TURNの仕組みを理解できる
- RTPの仕組みが説明できる
- 映像/音声コーデックの説明ができる
- DTLSのハンドシェイクが説明できる
- SCTP/DataChannelの説明ができる
- SDPが読めるようになる
- ICE Candidateが読めるようになる
- Vanilla/Trickle ICEの違いが説明できる
- フルコーンNATと対称NATの違いを理解できる
- MediaStream APIで映像音声の操作ができる
- video/audioタグが扱える
- 次世代プロトコル(WebTransport,HTTP/3)が説明できる
- WebSocketが説明できる
- フレーム間圧縮(I/B/Pフレーム)が説明できる

## 教科書

- [Real time communication with WebRTC](https://codelabs.developers.google.com/codelabs/webrtc-web#0)

## 副読本

- [WebRTC for the Curious](https://webrtcforthecurious.com/)
- [ネスペイージス：ネットワークスペシャリストWeb教科書](https://www.infraexpert.com/info/netspecial1.html)

## 参考資料

- [NATあれこれ](https://tech.zms.co.jp/nat%E3%81%82%E3%82%8C%E3%81%93%E3%82%8C/)
- [WebRTC徹底解説](https://zenn.dev/yuki_uchida/books/c0946d19352af5)
- [Network Cost : An Extension of ICE](https://yoshihisaonoue.wordpress.com/2021/05/03/network-cost-an-extension-of-ice/)

## ICE 参考資料
- [network-costの計算方法](https://chromium.googlesource.com/external/webrtc/+/master/rtc_base/network.cc)