const uuid = require("uuid/v1");
const {verifySignature} = require("../util");

class Transaction {
  constructor ({senderWallet, recipient, amount}) {
    this.id = uuid();
    this.outputMap = this.createOutputMap({senderWallet, recipient, amount});
    this.input = this.createInput({senderWallet, outputMap: this.outputMap});
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
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap)
    };
  }

  static isValidTransaction(transaction) {
    const {outputMap, input: {amount, address, signature}} = transaction;
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
}

module.exports = Transaction;
