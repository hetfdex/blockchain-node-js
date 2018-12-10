const cryptoHash = require("./crypto-hash");
const Blockchain = require("./blockchain");
const Block = require("./block");

describe("Blockchain", () => {
  let blockchain, replacementChain, originalChain, errorMock, logMock;

  beforeEach(() => {
    blockchain = new Blockchain();
    replacementChain = new Blockchain();

    originalChain = blockchain.chain;

    errorMock = jest.fn();
    logMock = jest.fn();

    global.console.error = errorMock;
    global.console.log = logMock;
  });

  it("constains a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds block to `chain`", () => {
    const data = [];

    blockchain.addBlock({data});

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
  });

  describe("isValidChain()", () => {
    describe("Without genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = {data: "fake-data"};

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("With genesis block", () => {
      beforeEach(() => {
        blockchain.addBlock({data: "data-one"});
        blockchain.addBlock({data: "data-two"});
        blockchain.addBlock({data: "data-three"});
      });

      describe("a `lastHash` has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "fake-lastHash";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("a `block` with an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "fake-data";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("a `block` with jumped difficulty", () => {
        it("returns false", () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];

          const timestamp = Date.now();
          const lastHash = lastBlock.hash;
          const data = [];
          const nonce = 0;
          const difficulty = lastBlock.difficulty - 3;
          const hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

          const badBlock = new Block({timestamp, lastHash, hash, data, nonce, difficulty});

          blockchain.chain.push(badBlock);

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("a `chain` is valid", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });

    describe("replaceChain()", () => {
      describe("`replacementChain` is shorter", () => {
        beforeEach(() => {
          replacementChain.chain[0] = {data: "fake-data"};

          blockchain.replaceChain(replacementChain.chain);
        });

        it("doesn't replace `blockchain`", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("`replacementChain` is longer", () => {
        beforeEach(() => {
          replacementChain.addBlock({data: "data-one"});
          replacementChain.addBlock({data: "data-two"});
          replacementChain.addBlock({data: "data-three  "});
        });

        describe("`replacementChain` is not valid", () => {
          beforeEach(() => {
            replacementChain.chain[2].lastHash = "fake-lastHash";

            blockchain.replaceChain(replacementChain.chain);
          });

          it("doesn't replace `blockchain`", () => {
            expect(blockchain.chain).toEqual(originalChain);
          });

          it("logs an error", () => {
            expect(errorMock).toHaveBeenCalled();
          });
        });

        describe("`replacementChain` is valid", () => {
          beforeEach(() => {
            blockchain.replaceChain(replacementChain.chain);
          });

          it("replaces `blockchain`", () => {
            expect(blockchain.chain).toEqual(replacementChain.chain);
          });

          it("logs", () => {
            expect(logMock).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
