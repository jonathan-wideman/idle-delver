import { createStore } from "@xstate/store-react"
import { loadGameState } from "./lib/gameState"

// DONE
const { gold: savedGold } = loadGameState()

// DONE
export const store = createStore({
  context: { gold: savedGold },
  on: {
    earnGold: (context, event: { amount?: number }) => ({
      gold: context.gold + (event.amount ?? 0),
    }),
    loseHp: (context, event: { amount?: number }) => ({
      gold: context.gold - (event.amount ?? 0),
    }),
    resetGold: () => ({
      gold: 0,
    }),
  },
})
