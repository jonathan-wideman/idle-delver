import { createStore } from "@xstate/store-react"
export const store = createStore({
  context: { count: 0 },
  on: {
    inc: (context, event: { by?: number }) => ({
      count: context.count + (event.by ?? 1),
    }),
    reset: () => ({
      count: 0,
    }),
  },
})
