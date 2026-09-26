import { randomInt } from "./rng.new"

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

export function generateSkillCards(max: number) {
  return [...new Array(max + 1)].map((value, index) => ({
    type: index === 0 ? CARD_TYPE.add : CARD_TYPE.number,
    value: index === 0 ? 1 : index,
  }))
}
