const Block = require("./block");
const {GENESIS_DATA} = require("./config");

describe("Block", () => {
  const timestamp = "timestamp";
  const lastHash = "lastHash";
  const hash = "hash";
  const data = "data";

  const block = new Block({timestamp, lastHash, hash, data});

  it("has timestamp", () => {
    expect(block.timestamp).toEqual(timestamp);
  });

  it("has lastHash", () => {
    expect(block.lastHash).toEqual(lastHash);
  });

  it("has hash", () => {
    expect(block.hash).toEqual(hash);
  });

  it("has data", () => {
    expect(block.data).toEqual(data);
  });

  describe("genesis()", () => {
    const genesisBlock = Block.genesis();

    it("returns block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it("returns genesis data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });
});
