import { store } from "./store"

export const gameTick = () => {
  store.trigger.inc()
}