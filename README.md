
# WebRTC Project

This project demonstrates a WebRTC connection between two HTML pages (`index.html` and `index2.html`). It is designed for debugging and understanding the fundamentals of WebRTC step by step. 

## Table of Contents

- [Overview](#overview)
- [Technical Explanation](#technical-explanation)
- [Project Setup](#project-setup)
- [How to Run the Project](#how-to-run-the-project)
- [Usage Instructions](#usage-instructions)
- [Browser Compatibility](#browser-compatibility)
- [Debugging Tools](#debugging-tools)

## Overview

The project involves establishing a peer-to-peer video connection using WebRTC. It includes functionalities to send offers, receive answers, manage ICE candidates, and dynamically change video resolutions.

## Technical Explanation

### Key WebRTC Concepts

1. **PeerConnection**: The main object used to connect two peers (clients). It handles the connection and media streaming.
2. **ICE Candidates**: Interactive Connectivity Establishment (ICE) candidates are network information that help establish a connection between peers. They are crucial for NAT traversal.
3. **Data Channel**: A bi-directional channel that allows the transfer of arbitrary data between peers.
4. **Session Description Protocol (SDP)**: A format used to describe multimedia communication sessions, including codec, format information, and network data.

### Flow of the Application

1. **Offer and Answer**: The connection is initiated by sending an offer from `index.html`. The offer is received by `index2.html`, which responds with an answer.
2. **ICE Candidates Exchange**: After the answer is received, ICE candidates are exchanged between the two pages to establish the best possible connection.
3. **Video Streaming**: Once the connection is established, video from `index.html` is streamed to `index2.html`.
4. **Dynamic Resolution Change**: The user can change the video resolution between 640p and 1080p using buttons provided in the interface.

## Project Setup

To set up the project, ensure you have [Node.js](https://nodejs.org/) installed on your machine. The following packages are required:

- **Express**: A minimal and flexible Node.js web application framework.
- **CORS**: A package to enable Cross-Origin Resource Sharing.

1. Navigate to the directory where your `server.js` file is located:
   
   ```bash
   cd path/to/your/project/server
   ```

2. Install the required packages with:

   ```bash
   npm install express cors
   ```

## How to Run the Project

1. Ensure you are in the `server` directory:

   ```bash
   cd server
   ```

2. Start the server:

   ```bash
   node server.js
   ```

3. Open two browser tabs. In the first tab, open `index.html` located in the `frontend1` directory. In the second tab, open `index2.html` located in the same directory.

## Usage Instructions

1. In `index.html`, click the **Send Offer** button to initiate the WebRTC connection.
2. Switch to `index2.html` and click the **Get Answer** button to receive the offer and respond with an answer.
3. Back in `index.html`, click **Send ICE Candidate** to send your ICE candidate to the server.
4. In `index2.html`, click **Get ICE Candidate** to retrieve the ICE candidate from the server and add it to your connection.
5. You can get your ICE candidates in `index.html` by clicking the **Get ICE Candidate** button.
6. Once connected, if you want to change the video resolution to 1080p, click the **1080p** button in `index2.html`. 
7. In `index.html`, click the corresponding button to adjust the video resolution.

## Browser Compatibility

This project has been developed and tested primarily in **Google Chrome**. Connection issues may arise when using other browsers. It's advisable to use Chrome for the best experience.

## Debugging Tools

You can monitor the WebRTC connection status and view detailed logs using the built-in WebRTC Internals in Chrome. Access it by navigating to `chrome://webrtc-internals/` in your browser.

---
