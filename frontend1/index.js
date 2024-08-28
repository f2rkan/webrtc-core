document.addEventListener("DOMContentLoaded", async function () {
    /*   const stunServer = "stun:3.67.24.50:3478";
    const turnServer = {
      urls: "turn:3.67.24.50:3478?transport=tcp",
      username: "1705566884:u_201",
      credential: "X7qbL0f3kasG1KWH01OONlEG8zQ=",
    }; */
  
    const configuration = { iceServers: [] };
    const pc = new RTCPeerConnection(configuration);
    const dc = pc.createDataChannel("data-channel");
    const localVideo = document.getElementById("localVideo");
    let localICECandidate;

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            localICECandidate = event.candidate;
            console.log("ICE Candidate:", event.candidate.candidate);
            console.log("NAT Type:", determineNATType(event.candidate.candidate));
        }
    };

    dc.onopen = () => {
        console.log("Data channel opened");
    };

    const constraints = {
        video: {
            width: { exact: 640 },
            height: { exact: 480 },
            frameRate: { exact: 15 },
        },
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    localVideo.srcObject = stream;
    const videoTrack = stream.getVideoTracks()[0];
    const sender = pc.addTrack(videoTrack, stream);

    if ("contentHint" in sender) {
        sender.contentHint = "detail";
        console.log("Content hint set to detail");
    } else {
        console.warn("Browser does not support content hint");
    }

    document.getElementById("button").addEventListener("click", async function () {
        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            console.log("Offer created:", offer);

            const response = await fetch("http://localhost:3001/send_offer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ offer: pc.localDescription }),
            });

            if (!response.ok) {
                console.error("Error sending offer to server");
            } else {
                console.log("Offer sent successfully");
            }
        } catch (error) {
            console.error("Error creating or sending offer:", error);
        }
    });

    document.getElementById("button2").addEventListener("click", async function () {
        try {
            const response = await fetch("http://localhost:3001/get_answer", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                const receivedAnswer = data.answer;

                if (receivedAnswer) {
                    await pc.setRemoteDescription(new RTCSessionDescription(receivedAnswer));
                    console.log("Remote description set successfully");
                } else {
                    console.error("Empty received answer");
                }
            } else {
                console.error("Error fetching answer:", response.statusText);
            }
        } catch (error) {
            console.error("Error during fetch for answer:", error);
        }
    });

    document.getElementById("button_get_ice_candidate").addEventListener("click", async function () {
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

    document.getElementById("button_send_ice_candidate").addEventListener("click", async function () {
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

    document.getElementById("get_resolution_and_framerate").addEventListener("click", async function () {
        try {
            const response = await fetch("http://localhost:3001/get_apply_constraints", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                const { width, height, framerate } = data.offer;

                const newConstraints = {
                    width: { ideal: width },
                    height: { ideal: height },
                    frameRate: { ideal: framerate },
                };

                const currentStream = localVideo.srcObject;
                const videoTrack = currentStream.getVideoTracks()[0];

                await videoTrack.applyConstraints(newConstraints);
                console.log("Video constraints updated successfully");
            } else {
                console.error("Error fetching resolution and framerate:", response.statusText);
            }
        } catch (error) {
            console.error("Error during fetch:", error);
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