import { store } from "./store.new"

const LOCALSTORAGE_KEY = "idle-delver-game-context"

// TODO: make a debug panel for persistence

// TODO: do we need more error handling / type checking?

export const loadContext = () => {
  const persistedContextString = localStorage.getItem(LOCALSTORAGE_KEY)
  const persistedContext = persistedContextString
    ? JSON.parse(persistedContextString)
    : undefined
  return persistedContext
}

export const saveContext = () => {
  const context = store.getSnapshot()
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(context))
}

export const clearSavedContext = () => {
  localStorage.removeItem(LOCALSTORAGE_KEY)
}
