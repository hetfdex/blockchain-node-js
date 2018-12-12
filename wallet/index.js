const {START_BALANCE} = require("../config");
const {cryptoHash, ec} = require("../util");
const Transaction = require("./transaction");

class Wallet {
  constructor() {
    this.balance = START_BALANCE;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction ({recipient, amount}) {
    if (amount > this.balance) {
      throw new Error("Creation Fail: Amount exceeds Balance");
    }

    return new Transaction({senderWallet: this, recipient, amount});
  }
}

module.exports = Wallet;
