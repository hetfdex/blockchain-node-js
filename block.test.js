const Block = require("./block");
const {GENESIS_DATA} = require("./config");
const cryptoHash = require("./crypto-hash");

describe("Block", () => {
  const timestamp = Date.now();
  const lastHash = "test-lastHash";
  const hash = "test-hash";
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

    it("has `timestamp`", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("has `lastHash` equal to `hash` of lastBlock", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("creates a SHA-256 `hash` based on proper inputs", () => {
      expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data));
    });

    it("has `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });
  });
});
