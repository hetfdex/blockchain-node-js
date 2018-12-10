const bodyParser = require("body-parser");
const express = require("express");
const Blockchain = require("./blockchain");

const PORT = 3000;

const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  const {data} = req.body;

  blockchain.addBlock({data});

  res.redirect("/api/blocks");
});

app.listen(PORT, () => console.log(`Listening on localhost:${PORT}`));
