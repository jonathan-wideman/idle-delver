import { Button } from "@/components/ui/button"
import useGameTimer from "@/lib/useGameTimer"

export function App() {
  const { tick, running, toggle, reset } = useGameTimer({ initialRunning: true })

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Idle Delver — Debug Time</h1>
          <p className="mt-2">Game time tick: <span className="font-mono">{tick}</span></p>
          <p>Status: <span className="font-mono">{running ? 'Running' : 'Paused'}</span></p>
          <div className="flex gap-2 mt-2">
            <Button onClick={toggle}>{running ? 'Pause' : 'Resume'}</Button>
            <Button onClick={reset}>Reset</Button>
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
