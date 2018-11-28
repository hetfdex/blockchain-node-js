describe("Block", () => {
  const timestamp = "timestamp";
  const lastHash = "lastHash";
  const hash = "hash";
  const data = "data";

  const block = new Block({timestamp, lastHash, hash, data});

  it("has all four base properties", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  })
});
