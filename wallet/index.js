const {START_BALANCE} = require("../config");
const {ec} = require("../util");
const cryptoHash = require("../util/crypto-hash");

class Wallet {
  constructor() {
    this.balance = START_BALANCE;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }
}

module.exports = Wallet;
