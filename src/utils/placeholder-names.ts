import placeholderConfig from "../config/placeholder-names.json";

/**
 * Returns default participant names for a new session.
 * The first name is fixed (e.g. "Dheeraj"), and the 2nd & 3rd names are chosen
 * as a set of 2 names randomly selected from placeholder-names.json.
 */
export function getRandomDefaultParticipants(): string[] {
  const fixed = placeholderConfig.fixedFirstName || "Dheeraj";
  const sets = placeholderConfig.nameSets as string[][];

  if (!sets || sets.length === 0) {
    return [fixed, "Pankaj", "Manish"];
  }

  const randomIndex = Math.floor(Math.random() * sets.length);
  const selectedSet = sets[randomIndex];

  return [fixed, ...selectedSet];
}
