const uuid = require("uuid/v1");
const {MINER_REWARD_INPUT, MINER_REWARD_AMOUNT} = require("../config");
const {verifySignature} = require("../util");

class Transaction {
  constructor ({senderWallet, recipient, amount, outputMap, input}) {
    this.id = uuid();
    this.outputMap = outputMap || this.createOutputMap({senderWallet, recipient, amount});
    this.input = input || this.createInput({senderWallet, outputMap: this.outputMap});
  }

  createOutputMap ({senderWallet, recipient, amount}) {
    const outputMap = {};

    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

    return outputMap;
  }

  createInput ({senderWallet, outputMap}) {
    return {
      timestamp: Date.now(),
      address: senderWallet.publicKey,
      amount: senderWallet.balance,
      signature: senderWallet.sign(outputMap)
    };
  }

  update({senderWallet, recipient, amount}) {
    if (amount > this.outputMap[senderWallet.publicKey]) {
      throw new Error("Update Fail: Amount exceeds Balance");
    }

    if (!this.outputMap[recipient]) {
      this.outputMap[recipient] = amount;
    } else {
      this.outputMap[recipient] = this.outputMap[recipient] + amount;
    }

    this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount;

    this.input = this.createInput({senderWallet, outputMap: this.outputMap});
}

  static isValidTransaction(transaction) {
    const {outputMap, input: {address, amount, signature}} = transaction;
    const outputTotal = Object.values(outputMap).reduce((total, outputAmount) => total + outputAmount);

    if (outputTotal !== amount) {
      console.error();("Validation Fail: OutputMap total must equal Input amount");

      return false;
    }

    if (!verifySignature({publicKey: address, data: outputMap, signature})) {
      console.error();("Validation Fail: Invalid Signature");

      return false;
    }
    console.log("Transaction valid", transaction);

    return true;
  }

  static getMinerRewardTransaction ({minerWallet}) {
    return new this({
      input: MINER_REWARD_INPUT,
      outputMap: {[minerWallet.publicKey]: MINER_REWARD_AMOUNT}
    });
  }
}

module.exports = Transaction;
