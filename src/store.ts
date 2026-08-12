import { createStore } from "@xstate/store-react"
import { loadGameState } from "./lib/gameState"

const { count: savedCount } = loadGameState()

export const store = createStore({
  context: { count: savedCount },
  on: {
    inc: (context, event: { by?: number }) => ({
      count: context.count + (event.by ?? 1),
    }),
    reset: () => ({
      count: 0,
    }),
  },
})
