import { randomInt } from "./rng.new"

export function newCharacter() {
  return {
    id: crypto.randomUUID() as string,
    name: "Leroy Jenkins",
    hp: 3,
    maxHp: 3,
    skills: {
      // TODO: random skills
      combat: [
        { type: CARD_TYPE.add, value: 1 },
        { type: CARD_TYPE.number, value: 1 },
        { type: CARD_TYPE.number, value: 2 },
        { type: CARD_TYPE.number, value: 3 },
        { type: CARD_TYPE.number, value: 4 },
        { type: CARD_TYPE.number, value: 5 },
        { type: CARD_TYPE.number, value: 6 },
        { type: CARD_TYPE.number, value: 7 },
        { type: CARD_TYPE.number, value: 8 },
        { type: CARD_TYPE.number, value: 9 },
        { type: CARD_TYPE.number, value: 10 },
      ],
      exploration: [
        { type: CARD_TYPE.add, value: 1 },
        { type: CARD_TYPE.number, value: 1 },
        { type: CARD_TYPE.number, value: 2 },
        { type: CARD_TYPE.number, value: 3 },
        { type: CARD_TYPE.number, value: 4 },
        { type: CARD_TYPE.number, value: 5 },
        { type: CARD_TYPE.number, value: 6 },
        { type: CARD_TYPE.number, value: 7 },
        { type: CARD_TYPE.number, value: 8 },
      ],
      social: [
        { type: CARD_TYPE.add, value: 1 },
        { type: CARD_TYPE.number, value: 1 },
        { type: CARD_TYPE.number, value: 2 },
        { type: CARD_TYPE.number, value: 3 },
        { type: CARD_TYPE.number, value: 4 },
        { type: CARD_TYPE.number, value: 5 },
        { type: CARD_TYPE.number, value: 6 },
      ],
    } as Record<Skill, Card[]>,
    mode: MODE.resting as Mode,
    currentTaskId: null as string | null,
  }
}

function newRandomSkills() {
  const cardSets = [
    [... new Array(11)].map((i) => ({}))
  ]
}

export function formatCard(card: Card) {
  if (card.type === CARD_TYPE.add) return `+${card.value}`
  if (card.type === CARD_TYPE.subtract) return `-${card.value}`
  return card.value
}

export function drawCards(deck: Card[]): Card[] {
  const cardIndex = randomInt(0, deck.length - 1)
  const card = deck[cardIndex]
  const remainder = deck.toSpliced(cardIndex, 1)
  if (card.type === CARD_TYPE.number || remainder.length === 0) {
    return [card]
  } else {
    // If it's not a number, draw another card from the remaining deck
    return [card, ...drawCards(remainder)]
  }
}

export function resolveCardsResult(hand: Card[]) {
  return hand.reduce((total, card) => {
    return card.type === CARD_TYPE.number || card.type === CARD_TYPE.add
      ? total + card.value
      : total - card.value
  }, 0)
}

export const CARD_TYPE = {
  number: "number",
  add: "add",
  subtract: "subtract",
} as const
export type CardType = (typeof CARD_TYPE)[keyof typeof CARD_TYPE]
export type Card = {
  type: CardType
  value: number
}

export const MODE = {
  adventuring: "adventuring",
  resting: "resting",
} as const
export type Mode = (typeof MODE)[keyof typeof MODE]

export const SKILL = {
  combat: "combat",
  exploration: "exploration",
  social: "social",
} as const
export const SKILLS = Object.keys(SKILL) as Skill[]
export type Skill = (typeof SKILL)[keyof typeof SKILL]

export type Character = ReturnType<typeof newCharacter>
