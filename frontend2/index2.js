document.addEventListener("DOMContentLoaded", async function () {
    /* const stunServer = "stun:51.12.248.128:3478";
    const turnServer = {
      urls: "turn:51.12.248.128:3478?transport=tcp",
      username: "1705587034:u_201",
      credential: "SVvLcRTOFA5wLckdhtSCXm/D9kw=",
    }; */
  
    const configuration = { iceServers: [] };
    const pc = new RTCPeerConnection(configuration);
    let localICECandidate;

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            localICECandidate = event.candidate;
            console.log("ICE Candidate:", event.candidate.candidate);
            console.log("NAT Type:", determineNATType(event.candidate.candidate));
        }
    };

    pc.onconnectionstatechange = () => {
        console.log("Connection State:", pc.connectionState);
        if (pc.connectionState === "connected") {
            console.log("Peer connection established");
        }
    };

    pc.oniceconnectionstatechange = () => {
        console.log("ICE Connection State:", pc.iceConnectionState);
        if (pc.iceConnectionState === "connected") {
            console.log("Peer connection established via ICE");
        }
    };

    pc.addEventListener("track", (event) => {
        if (event.streams && event.streams[0]) {
            document.getElementById("remoteVideo").srcObject = event.streams[0];
        }
    });

    document.getElementById("button3").addEventListener("click", async function () {
        try {
            const response = await fetch("http://localhost:3001/get_offer", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                const receivedOffer = data.offer;

                if (receivedOffer) {
                    await pc.setRemoteDescription(new RTCSessionDescription(receivedOffer));
                    console.log("Remote description set successfully");
                }
            } else {
                console.error("Error fetching offer:", response.statusText);
            }
        } catch (error) {
            console.error("Error during fetch for offer:", error);
        }
    });

    document.getElementById("button4").addEventListener("click", async function () {
        try {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            const sendAnswerResponse = await fetch("http://localhost:3001/send_answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer }),
            });

            if (sendAnswerResponse.ok) {
                console.log("Answer sent successfully");
            } else {
                console.error("Error sending answer:", sendAnswerResponse.statusText);
            }
        } catch (error) {
            console.error("Error creating or sending answer:", error);
        }
    });

    document.getElementById("button_send_peer2_ice_candidate").addEventListener("click", async function () {
        if (localICECandidate) {
            try {
                const response = await fetch("http://localhost:3001/send_ice_candidate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ candidate: localICECandidate }),
                });
                console.log("ICE candidate sent to server:", response);
            } catch (error) {
                console.error("Error sending ICE candidate:", error);
            }
        } else {
            console.error("No local ICE candidate available");
        }
    });

    document.getElementById("button_get_peer2_ice_candidate").addEventListener("click", async function () {
        try {
            const response = await fetch("http://localhost:3001/get_ice_candidate", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                const receivedIceCandidate = data.iceCandidate;

                if (receivedIceCandidate) {
                    await pc.addIceCandidate(new RTCIceCandidate(receivedIceCandidate));
                    console.log("ICE candidate added successfully");
                }
            } else {
                console.error("Error fetching ICE candidate:", response.statusText);
            }
        } catch (error) {
            console.error("Error during fetch for ICE candidate:", error);
        }
    });

    function determineNATType(candidate) {
        if (candidate.includes("typ srflx")) {
            return "STUN reflexive NAT (Type-NAT)";
        } else if (candidate.includes("typ relay")) {
            return "TURN relayed NAT (Type-TURN)";
        } else if (candidate.includes("typ host")) {
            return "Public IP (no NAT)";
        } else {
            return "Unknown NAT type";
        }
    }
});