const Blockchain = require("./blockchain");
const Block = require("./block");

describe("Blockchain", () => {
  const blockchain = new Blockchain();

  it("constains a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds block to chain", () => {
    const data = [];

    blockchain.addBlock({data});

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
  });
});
