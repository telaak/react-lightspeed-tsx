import EventEmitter from 'events';

export class LightSpeed extends EventEmitter {
  webSocketUrl: string;
  mediaStream: MediaStream;
  webSocket: WebSocket;
  rtcPeerConnection: RTCPeerConnection;

  constructor(websocketUrl: string) {
    super()
    this.webSocketUrl = websocketUrl;
    this.webSocket = new WebSocket(websocketUrl);
    this.rtcPeerConnection = new RTCPeerConnection();
    this.mediaStream = new MediaStream()
    this.init()
  }

  init() {
    this.rtcPeerConnection.addTransceiver("audio", { direction: "recvonly" });
    this.rtcPeerConnection.addTransceiver("video", { direction: "recvonly" });

    this.rtcPeerConnection.ontrack = (event) => {
      const {
        track: { kind },
        streams,
      } = event;

      if (kind === "video") {
        this.mediaStream = streams[0];
        this.emit('newStream', this.mediaStream)
      }
    };

    this.rtcPeerConnection.onicecandidate = (e) => {
      const { candidate } = e;
      if (candidate) {
        console.log("Candidate success");
        this.webSocket.send(
          JSON.stringify({
            event: "candidate",
            data: e.candidate,
          })
        );
      }
    };

    this.webSocket.onmessage = async (event) => {
      const msg = JSON.parse(event.data);

      if (!msg) {
        console.log("Failed to parse msg");
        return;
      }

      const offerCandidate = msg.data;

      if (!offerCandidate) {
        console.log("Failed to parse offer msg data");
        return;
      }

      switch (msg.event) {
        case "offer":
          console.log("Offer");
          this.rtcPeerConnection.setRemoteDescription(offerCandidate);

          const answer = await this.rtcPeerConnection.createAnswer();
          this.rtcPeerConnection.setLocalDescription(answer);
          this.webSocket.send(
            JSON.stringify({
              event: "answer",
              data: answer,
            })
          );

          return;
        case "candidate":
          console.log("Candidate");
          this.rtcPeerConnection.addIceCandidate(offerCandidate);
          return;
      }
    };
  }
}
