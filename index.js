const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const Blockchain = require("./blockchain");
const PubSub = require("./pubsub");

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

let PEER_POST;

if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_POST = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_POST || DEFAULT_PORT;

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});

app.use(bodyParser.json());

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  const {data} = req.body;

  blockchain.addBlock({data});

  pubsub.broadcastChain();

  res.redirect("/api/blocks");
});

const syncChains = () => {
  request({url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body) => {
    if(!error && response.statusCode  === 200) {
      const rootChain = JSON.parse(body);

      console.log("Syncing blockchain", rootChain);

      blockchain.replaceChain(rootChain);
    }
    else {
      console.log(response.statusCode, error);
    }
  });
};

app.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`)

  if(PORT !== DEFAULT_PORT) {
    syncChains();
  }
});
