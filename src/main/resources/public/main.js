const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

let localStream;
let remoteStream;
let peerConnection;

// WebSocket 연결 -> cmd 창에서 ipconfig -> ipv4 address 를 아래에 작성
const socket = new WebSocket("wss://ipv4 address:8443/ws/chat");

// WebSocket 연결이 열렸을 때
socket.onopen = () => {
    console.log("Connected to WebSocket server");
};

// WebSocket이 닫혔을 때
socket.onclose = () => {
    console.warn("Disconnected from WebSocket server");
};

// WebSocket 오류가 발생했을 때
socket.onerror = (error) => {
    console.error("WebSocket error:", error);
};

// WebSocket 메시지를 수신할 때
socket.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    console.log("Received WebSocket message:", message);  // 수신된 메시지 로그

    if (message.type === "offer") {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: "answer", answer }));
        console.log("Sent answer:", answer);  // answer 전송 로그 추가
    } else if (message.type === "answer") {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
        console.log("Set remote description with answer");  // answer 설정 로그 추가
    } else if (message.type === "candidate") {
        await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
        console.log("Added ICE candidate:", message.candidate);  // ICE 후보자 추가 로그
    }
};

// ICE 후보 수신 시 WebSocket을 통해 전송
peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
        socket.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
        console.log("Sent ICE candidate:", event.candidate);  // ICE 후보자 전송 로그
    }
};


// 로컬 비디오 및 오디오 스트림 설정
async function startCall() {
    try {
        // 카메라와 마이크 권한 요청
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
    } catch (error) {
        console.error("Error accessing camera and microphone:", error);
        alert("카메라와 마이크에 접근할 수 없음. 브라우저의 권한을 확인해주세요.");
    }
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
