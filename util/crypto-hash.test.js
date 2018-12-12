const cryptoHash = require("./crypto-hash");

describe("cryptoHash()", () => {
  it("generates a SHA-256 output", () => {
    expect(cryptoHash("hetfdex")).toEqual("00e911748a6a102a9905945986ed645e4c93ba113e537d0d0eb656df6b3c8b28");
  });

  it("produces the same hash with arguments in any order", () => {
    expect(cryptoHash("one", "two", "three")).toEqual(cryptoHash("two", "one", "three"));
  });

  it("produces a unique hash when the input properties have changed", () => {
    const obj = {};
    const originalHash = cryptoHash(obj);

    obj["a"] = "a";

    expect(cryptoHash(obj)).not.toEqual(originalHash);
  });
});
