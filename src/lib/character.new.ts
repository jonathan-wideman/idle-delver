export function newCharacter() {
  return {
    id: crypto.randomUUID() as string,
    name: "Leroy Jenkins",
    hp: 3,
    maxHp: 3,
    skills: {
      // TODO: random skills
      combat: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      exploration: [1, 2, 3, 4, 5, 6, 7, 8],
      social: [1, 2, 3, 4, 5, 6],
    } as Record<Skill, number[]>,
    mode: MODE.resting as Mode,
    currentTaskId: null as string | null,
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
