import { Button } from "@/components/ui/button"
import { useCallback } from "react"
import useGameTimer from "@/lib/useGameTimer"
import { gameTick } from "./gameTick"
import { useSelector } from "@xstate/store-react"
import { store } from "./store"

export function App() {
  const { tick, running, toggle, resetTimer } = useGameTimer({
    initialRunning: true,
    onTick: gameTick,
  })
  const count = useSelector(store, (state) => state.context.count)

  const resetAll = useCallback(() => {
    resetTimer()
    store.trigger.reset()
  }, [resetTimer])

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Idle Delver — Debug Time</h1>
          <p className="mt-2">
            Game time tick: <span className="font-mono">{tick}</span>
          </p>
          <p>
            Status:{" "}
            <span className="font-mono">{running ? "Running" : "Paused"}</span>
          </p>
          <div className="mt-2 flex gap-2">
            <Button onClick={toggle}>{running ? "Pause" : "Resume"}</Button>
            <Button onClick={resetAll}>Reset</Button>
          </div>
          <p className="mt-2">
            Count: <span className="font-mono">{count}</span>
          </p>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}

export default App
