const {verifySignature} = require("../util");
const Wallet = require("./index");
const Transaction = require("./transaction");

describe("Transaction", () => {
  let transaction, senderWallet, recipient, amount;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = "test-recipient";
    amount = 100;

    transaction = new Transaction({senderWallet, recipient, amount});
  });

  it("has `id`", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("outputMap", () => {
    it("has `outputMap`", () => {
      expect(transaction).toHaveProperty("outputMap");
    });

    it("outputs the amount to the recipient", () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it("outputs remaining amount back to sender", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
    });
  });

  describe("input", () => {
    it("has `input`", () => {
      expect(transaction).toHaveProperty("input");
    });

    it("contains `timestamp`", () => {
      expect(transaction.input).toHaveProperty("timestamp");
    });

    it("contains `senderWallet`'s balance as `amount`", () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it("contains `senderWallet`'s publicKey as `address`", () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it("is signed", () => {
      expect(verifySignature({
        publicKey: senderWallet.publicKey,
        data: transaction.outputMap,
        signature: transaction.input.signature
      })).toBe(true);
    });
  });
});
