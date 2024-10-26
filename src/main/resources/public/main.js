const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

let localStream;
let remoteStream;
let peerConnection;

// WebSocket 연결
const socket = new WebSocket("ws://localhost:8080/ws/chat");

// WebSocket 연결이 열렸을 때
socket.onopen = () => {
    console.log("Connected to WebSocket server");
};

// WebSocket 메시지를 수신할 때
socket.onmessage = async (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "offer") {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: "answer", answer }));
    } else if (message.type === "answer") {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
    } else if (message.type === "candidate") {
        await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
    }
};

// 로컬 비디오 및 오디오 스트림 설정
async function startCall() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    // PeerConnection 생성
    createPeerConnection();

    // 로컬 스트림을 PeerConnection에 추가
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // Offer 생성 및 전송
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.send(JSON.stringify({ type: "offer", offer }));
}

// PeerConnection 설정
function createPeerConnection() {
    peerConnection = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" }
        ]
    });

    // 원격 스트림을 수신할 때
    peerConnection.ontrack = (event) => {
        if (!remoteStream) {
            remoteStream = new MediaStream();
            remoteVideo.srcObject = remoteStream;
        }
        remoteStream.addTrack(event.track);
    };

    // ICE 후보 수신 시 WebSocket을 통해 전송
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
        }
    };
}
