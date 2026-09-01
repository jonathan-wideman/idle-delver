import { SKILLS } from "./character.new"
import { choose, randomInt } from "./rng.new"

export function newTask(type?: TaskType) {
  const taskType = type ?? choose<TaskType>(TASK_TYPES)
  const skill = taskType === TASK_TYPE.dungeon ? choose(SKILLS) : null
  const difficulty = taskType === TASK_TYPE.dungeon ? randomInt(2, 10) : null
  return {
    id: crypto.randomUUID() as string,
    name: `A ${taskType}${skill ? ` ${skill}` : ""} task`,
    type: taskType,
    maxProgress: randomInt(5, 10),
    progress: 0, // TODO: move to new Assignment object, maybe on hero
    skill,
    difficulty,
  }
}

export const TASK_TYPE = {
  dungeon: "dungeon",
  healing: "healing",
} as const
export const TASK_TYPES = Object.keys(TASK_TYPE) as TaskType[]
export type TaskType = (typeof TASK_TYPE)[keyof typeof TASK_TYPE]

export type Task = ReturnType<typeof newTask>
