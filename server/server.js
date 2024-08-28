const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
var offer, answer, iceCandidate;

app.use(cors());
app.use(express.json());

app.post("/send_offer", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  console.log("req.body.offer", req.body.offer);
  offer = req.body.offer;
  res.sendStatus(200);
});

app.get("/get_offer", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  console.log("ofr", offer);
  res.json({ offer });
});

app.post("/send_answer", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  console.log("req.body.answer", req.body.answer);
  answer = req.body.answer;
  res.sendStatus(200);
});

app.get("/get_answer", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  console.log("ans", answer);
  res.json({ answer });
});

app.post("/send_ice_candidate", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  console.log("req.body.candidate", req.body.candidate);
  iceCandidate = req.body.candidate;
  res.sendStatus(200);
});

app.get("/get_ice_candidate", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  console.log("iceCandidate", iceCandidate);
  res.json({ iceCandidate });
});

app.post("/post_apply_constraints", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  const { width, height, framerate } = req.body;
  console.log("req", req.body);
  offer = { width, height, framerate };

  res.sendStatus(200);
});

app.get("/get_apply_constraints", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  res.json({ offer });
});

app.listen(port, () => {
  console.log(`Server http://localhost:${port} adresinde çalışıyor.`);
});
