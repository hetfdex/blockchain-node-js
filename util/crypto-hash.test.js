const cryptoHash = require("./crypto-hash");

describe("cryptoHash()", () => {
  it("generates a SHA-256 output", () => {
    expect(cryptoHash("hetfdex")).toEqual("5aa9f91f2c781d70f4201aff39ea9026a5566a28515825d5164979d46831c5e0");
  });
  
  it("produces the same hash with arguments in any order", () => {
    expect(cryptoHash("one", "two", "three")).toEqual(cryptoHash("two", "one", "three"));
  });
});
