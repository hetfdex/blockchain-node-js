const Block = require("./block");
const {GENESIS_DATA} = require("./config");

describe("Block", () => {
  const timestamp = Date.now();
  const lastHash = "temp-lastHash";
  const hash = "temp-hash";
  const data = [];

  const block = new Block({timestamp, lastHash, hash, data});

  it("has `timestamp`", () => {
    expect(block.timestamp).toEqual(timestamp);
  });

  it("has temp `lastHash`", () => {
    expect(block.lastHash).toEqual(lastHash);
  });

  it("has temp `hash`", () => {
    expect(block.hash).toEqual(hash);
  });

  it("has `data`", () => {
    expect(block.data).toEqual(data);
  });

  describe("genesis()", () => {
    const genesisBlock = Block.genesis();

    it("is Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it("has `GENESIS_DATA`", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("mineBlock()", () => {
    const lastBlock = Block.genesis();

    const data = [];

    const minedBlock = Block.mineBlock({lastBlock, data});

    it("is Block instance", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it("has `lastHash` equal to `hash` of lastBlock", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("has `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("has `timestamp`", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });
  });
});
