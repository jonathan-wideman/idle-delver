export type GameSkill = "combat" | "exploration" | "social"

type TaskType = "dungeon" | "healing"

export type GameTask = {
  type: TaskType
  skill: GameSkill | null
  requiredTicks: number
  progress: number
  difficulty: number | null
}

export type HeroState = {
  hp: number
  maxHp: number
  mode: "adventuring" | "resting"
  currentTask: GameTask | null
}

export type GameState = {
  tick: number
  running: boolean
  gold: number
  lastProcessedMs: number
  hero: HeroState
}

const STORAGE_GAME_STATE_KEY = "idle-delver-game-state"

const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value)
const isBoolean = (value: unknown): value is boolean => typeof value === "boolean"
const isString = (value: unknown): value is string => typeof value === "string"

function isValidTask(value: unknown): value is GameTask {
  if (typeof value !== "object" || value === null) return false
  const task = value as Record<string, unknown>
  return (
    (task.type === "dungeon" || task.type === "healing") &&
    (task.skill === null || task.skill === "combat" || task.skill === "exploration" || task.skill === "social") &&
    isNumber(task.requiredTicks) &&
    isNumber(task.progress) &&
    (task.difficulty === null || isNumber(task.difficulty))
  )
}

function isValidHero(value: unknown): value is HeroState {
  if (typeof value !== "object" || value === null) return false
  const hero = value as Record<string, unknown>
  return (
    isNumber(hero.hp) &&
    isNumber(hero.maxHp) &&
    (hero.mode === "adventuring" || hero.mode === "resting") &&
    (hero.currentTask === null || isValidTask(hero.currentTask))
  )
}

function isValidGameState(value: unknown): value is GameState {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const state = value as Record<string, unknown>
  return (
    isNumber(state.tick) &&
    isBoolean(state.running) &&
    isNumber(state.gold) &&
    isNumber(state.lastProcessedMs) &&
    isValidHero(state.hero)
  )
}

export function loadGameState(): GameState {
  const fallback: GameState = {
    tick: 0,
    running: true,
    gold: 0,
    lastProcessedMs: Date.now(),
    hero: {
      hp: 3,
      maxHp: 3,
      mode: "resting",
      currentTask: null,
    },
  }

  if (typeof localStorage === "undefined") {
    return fallback
  }

  try {
    const raw = localStorage.getItem(STORAGE_GAME_STATE_KEY)
    if (!raw) return fallback

    const parsed = JSON.parse(raw)
    return isValidGameState(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export function saveGameState(state: GameState) {
  if (typeof localStorage === "undefined") {
    return
  }

  try {
    localStorage.setItem(STORAGE_GAME_STATE_KEY, JSON.stringify(state))
  } catch {
    // ignore storage failures
  }
}
