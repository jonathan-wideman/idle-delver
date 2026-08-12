export type GameState = {
  tick: number
  running: boolean
  count: number
  lastProcessedMs: number
}

const STORAGE_GAME_STATE_KEY = "idle-delver-game-state"

const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value)

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean"

function isValidGameState(value: unknown): value is GameState {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const state = value as Record<string, unknown>
  return (
    isNumber(state.tick) &&
    isBoolean(state.running) &&
    isNumber(state.count) &&
    isNumber(state.lastProcessedMs)
  )
}

export function loadGameState(): GameState {
  const fallback: GameState = {
    tick: 0,
    running: true,
    count: 0,
    lastProcessedMs: Date.now(),
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
