import { describe, it, expect } from "vitest";
import { getRandomDefaultParticipants } from "../utils/placeholder-names";
import placeholderConfig from "../config/placeholder-names.json";

describe("getRandomDefaultParticipants", () => {
  it("should return array of 3 participant names", () => {
    const participants = getRandomDefaultParticipants();
    expect(participants).toHaveLength(3);
  });

  it("should always have Dheeraj (fixedFirstName) as the first participant", () => {
    for (let i = 0; i < 5; i++) {
      const participants = getRandomDefaultParticipants();
      expect(participants[0]).toBe(placeholderConfig.fixedFirstName);
    }
  });

  it("should select 2nd and 3rd names from one of the configured nameSets", () => {
    const validPairs = placeholderConfig.nameSets.map((pair) => pair.join(","));

    for (let i = 0; i < 15; i++) {
      const participants = getRandomDefaultParticipants();
      const pairKey = [participants[1], participants[2]].join(",");
      expect(validPairs).toContain(pairKey);
    }
  });
});
