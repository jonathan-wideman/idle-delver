import { store } from "./store.new"

const LOCALSTORAGE_KEY = "idle-delver-game-context"

// TODO: do we need more error handling / type checking?

export const loadContext = () => {
  const persistedContextString = localStorage.getItem(LOCALSTORAGE_KEY)
  const persistedContext = persistedContextString
    ? JSON.parse(persistedContextString)
    : undefined
  if (!persistedContext) {
    console.log("No persisted context found")
    return undefined
  }
  console.log("Loading persisted context:", persistedContext)
  return persistedContext
}

export const saveContext = () => {
  const context = store.getSnapshot().context
  console.log("Saving context:", context)
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(context))
}

export const clearSavedContext = () => {
  localStorage.removeItem(LOCALSTORAGE_KEY)
}
