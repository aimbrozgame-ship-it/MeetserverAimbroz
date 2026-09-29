# MeetserverAimbroz

A professional 10-person video meeting starter built with Node.js, Express, Socket.IO and browser WebRTC.

## Run locally
1. Install Node.js 18+.
2. In this folder run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000`.
5. Create a meeting and open the invite URL in up to 10 browser tabs/devices.

## Deploy
Deploy the folder to a Node.js host that supports WebSockets. Set the start command to `npm start`.

## Production note
The demo uses a public STUN server and peer-to-peer WebRTC mesh. For reliable production calls across restrictive networks, add a TURN server; for larger/production conferencing, use an SFU such as LiveKit/mediasoup.
