const Wallet = require("./index");
const {verifySignature} = require("../util");

describe("Wallet", () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it("has `balance`", () => {
    expect(wallet).toHaveProperty("balance");
  });

  it("has `publicKey`", () => {
    expect(wallet).toHaveProperty("publicKey");
  });

  describe("Data Signing", () => {
    const data = "test-data";

    it("verifies valid signature", () => {
      expect(verifySignature({
        publicKey: wallet.publicKey,
        data,
        signature: wallet.sign(data)
      })).toBe(true);
    });

    it("doesn't verify invalid signature", () => {
      expect(verifySignature({
        publicKey: wallet.publicKey,
        data,
        signature: new Wallet().sign(data)
      })).toBe(false);
    });
  });
});
