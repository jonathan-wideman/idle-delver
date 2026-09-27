import { type Card, generateSkillCards } from "./cards.new"
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
  let values = [6, 8, 10]
  rng.shuffle(values)
  return {
    combat: generateSkillCards(values[0], "combat"),
    exploration: generateSkillCards(values[1], "exploration"),
    social: generateSkillCards(values[2], "social"),
  }
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
