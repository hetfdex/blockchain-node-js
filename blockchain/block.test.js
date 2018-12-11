const hexToBinary = require("hex-to-binary");
const {GENESIS_DATA, MINE_RATE} = require("../config");
const cryptoHash = require("../util/crypto-hash");
const Block = require("./block");

describe("Block", () => {
  const timestamp = Date.now();
  const lastHash = "test-lastHash";
  const hash = "test-hash";
  const data = [];
  const nonce = 0;
  const difficulty = 1;
  const block = new Block({timestamp, lastHash, hash, data, nonce, difficulty});

  it("has `timestamp`", () => {
    expect(block.timestamp).toEqual(timestamp);
  });

  it("has `lastHash`", () => {
    expect(block.lastHash).toEqual(lastHash);
  });

  it("has `hash`", () => {
    expect(block.hash).toEqual(hash);
  });

  it("has `data`", () => {
    expect(block.data).toEqual(data);
  });

  it("has `nonce`", () => {
    expect(block.nonce).toEqual(nonce);
  });

  it("has `difficulty`", () => {
    expect(block.difficulty).toEqual(difficulty);
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
      expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data, minedBlock.nonce, minedBlock.difficulty));
    });

    it("creates a SHA-256 `hash` based on difficulty criteria", () => {
      expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual("0".repeat(minedBlock.difficulty));
    });

    it("has `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("adjusts 'difficulty'", () => {
      const possibleResults = [lastBlock.difficulty - 1, lastBlock.difficulty + 1];

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });

    describe("adjustDifficulty()", () => {
      it("raises the 'difficulty' if mining is too quick", () => {
        expect(Block.adjustDifficulty({
          block,
          timestamp: block.timestamp + MINE_RATE - 100
        })).toEqual(block.difficulty + 1);
      });

      it("lowers the 'difficulty' if mining is too slow", () => {
        expect(Block.adjustDifficulty({
          block,
          timestamp: block.timestamp + MINE_RATE + 100
        })).toEqual(block.difficulty - 1);
      });

      it("'difficulty' has a lower limit of 1", () => {
        block.difficulty = -1;

        expect(Block.adjustDifficulty({block: block})).toEqual(1);
      });
    });
  });
});
