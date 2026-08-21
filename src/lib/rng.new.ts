export function rollDie(sides: number) {
  return randomInt(1, sides)
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function choose<T>(arr: T[] | readonly T[]): T {
  return arr[randomInt(0, arr.length - 1)]
}
