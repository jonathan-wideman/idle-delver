import { MersenneTwister19937, Random } from "random-js";

export const rng = new Random(
  MersenneTwister19937.autoSeed()
);

export function rollDie(sides: number) {
  return randomInt(1, sides)
}

export function randomInt(min: number, max: number) {
  return rng.integer(min, max)
}

export function choose<T>(arr: T[] | readonly T[]): T {
  return rng.pick(arr)
}