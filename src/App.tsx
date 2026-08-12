import { Button } from "@/components/ui/button"
import { useCallback, useEffect, useMemo, useState } from "react"
import useGameTimer from "@/lib/useGameTimer"
import { gameTick } from "./gameTick"
import { loadGameState, saveGameState } from "@/lib/gameState"
import { useSelector } from "@xstate/store-react"
import { store } from "./store"

export function App() {
  const [logs, setLogs] = useState<string[]>([])

  const savedState = useMemo(() => loadGameState(), [])

  const appendLog = useCallback((message: string) => {
    setLogs((previous) => [message, ...previous].slice(0, 50))
  }, [])

  const { tick, running, lastProcessedMs, pause, resume, resetTimer } =
    useGameTimer({
      initialRunning: savedState.running,
      initialTick: savedState.tick,
      initialLastProcessedMs: savedState.lastProcessedMs,
      onTick: gameTick,
      onLog: appendLog,
    })

  const recentLogs = useMemo(
    () => logs.map((line, index) => <div key={`${index}-${line}`}>{line}</div>),
    [logs]
  )

  const count = useSelector(store, (state) => state.context.count)

  useEffect(() => {
    saveGameState({
      tick,
      running,
      count,
      lastProcessedMs,
    })
  }, [tick, running, count, lastProcessedMs])

  const resetAll = useCallback(() => {
    resetTimer()
    store.trigger.reset()
  }, [resetTimer])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

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
            <Button onClick={running ? pause : resume}>
              {running ? "Pause" : "Resume"}
            </Button>
            <Button onClick={resetAll}>Reset</Button>
          </div>
          <p className="mt-2">
            Count: <span className="font-mono">{count}</span>
          </p>
          <div className="mt-4 w-md rounded border border-border bg-background p-3 font-mono text-xs text-slate-100 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium">
              <span>Debug log</span>
              <Button variant="secondary" size="sm" onClick={clearLogs}>
                Clear logs
              </Button>
            </div>
            <div className="w-full max-h-56 overflow-auto rounded bg-slate-950/80 p-2 text-[11px] leading-5 text-slate-200 break-words">
              {recentLogs.length > 0 ? (
                recentLogs
              ) : (
                <div className="text-slate-500">No debug messages yet.</div>
              )}
            </div>
          </div>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}

export default App
