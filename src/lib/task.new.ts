import { SKILLS } from "./character.new"
import { choose, randomInt } from "./rng.new"

export function newTask(type?: TaskType) {
  const taskType = type ?? choose<TaskType>(TASK_TYPES)
  const skill = taskType === TASK_TYPE.dungeon ? choose(SKILLS) : null
  const difficulty = taskType === TASK_TYPE.dungeon ? randomInt(2, 10) : null
  return {
    id: crypto.randomUUID() as string,
    name: taskName(taskType, skill ?? "", difficulty ?? 0),
    type: taskType,
    maxProgress: randomInt(5, 10),
    progress: 0, // TODO: move to new Assignment object, maybe on hero
    skill,
    difficulty,
  }
}

function taskName(type: TaskType, skill: string, difficulty: number) {
  // previously, was
  // return `A ${type} ${skill} task (difficulty ${difficulty})`
  
  return `A ${choose(TASK_DESCRIPTORS[type].adjectives)} ${choose(TASK_DESCRIPTORS[type].nouns)}`
}

export const TASK_TYPE = {
  dungeon: "dungeon",
  healing: "healing",
} as const
export const TASK_TYPES = Object.keys(TASK_TYPE) as TaskType[]
export type TaskType = (typeof TASK_TYPE)[keyof typeof TASK_TYPE]

export type Task = ReturnType<typeof newTask>

// TODO: make descriptors for different base skills
export const TASK_DESCRIPTORS = {
  dungeon: {
    adjectives: [
      "dangerous",
      "dreadful",
      "horrid",
      "terrible",
      "tremendous",
      "harrowing",
      "deep",
      "dark",
      "gloomy",
      "grim",
      "vacuous",
      "vile",
    ],
    nouns: [
      "cave",
      "cavern",
      "crypt",
      "delve",
      "dungeon",
      "grotto",
      "labyrinth",
      "maze",
      "sepulcher",
      "temple",
      "vault",
    ],
  },
  healing: {
    adjectives: [
      "healing",
      "peaceful",
      "refreshing",
      "rejuventating",
      "relaxing",
      "restful",
      "restorative",
      "revitalizing",
    ],
    nouns: [
      "bath",
      "evening",
      "meal",
      "meditation",
      "morning",
      "recovery",
      "relaxation",
      "respite",
      "rest",
      "sleep",
      "sojourn",
      "treatment",
    ],
  },
}
