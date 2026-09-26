import { type Card, CARD_TYPE, generateSkillCards } from "./cards.new"
import { rng } from "./rng.new"

export function newCharacter() {
  return {
    id: crypto.randomUUID() as string,
    name: "Leroy Jenkins",
    hp: 3,
    maxHp: 3,
    skills: newRandomSkills() as Record<Skill, Card[]>,
    mode: MODE.resting as Mode,
    currentTaskId: null as string | null,
  }
}

function newRandomSkills() {
  const cardSets = [
    generateSkillCards(6),
    generateSkillCards(8),
    generateSkillCards(10),
  ]
  console.log(cardSets)
  rng.shuffle(cardSets)
  const [combat, exploration, social] = cardSets
  return { combat, exploration, social }
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
