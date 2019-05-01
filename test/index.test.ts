import { expect } from "chai";
import { computeOffSets } from "../src";

describe("Weather", () => {
  it("should compute time", () => {
    const time = { dstOffset: 3600, rawOffset: -21600 };

    expect(computeOffSets(time)).to.equal(-18000000)
  });
});
