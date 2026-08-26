import { useSelector } from "@xstate/store-react"
import { Panel } from "./components/custom/hoc/Panel"
import { PanelTitle } from "./components/custom/hoc/PanelTitle"
import { store } from "./lib/store.new"
import { Button } from "./components/ui/button"

// FIXME: setRunning type
export function DebugTimePanel({ running, setRunning }: { running: boolean, setRunning: () => void }) {
  const ticks = useSelector(
    store,
    (state) => state.context.meta.time.ticks
  ) as number
  const lastTickAt = useSelector(
    store,
    (state) => state.context.meta.time.lastTickAt
  ) as number
  // TODO: start / pause / stop timer
  // const running = true
  return (
    <Panel>
      <PanelTitle>Debug Time</PanelTitle>
      <div>Ticks: {ticks}</div>
      <div>Last Tick At: {lastTickAt}</div>
      {/* TODO: timer functionality */}
      {/* TODO: start / pause / stop timer */}
      <div>
        <Button onClick={() => { setRunning(!running) }}>{running ? "Pause" : "Resume"}</Button>{" "}
        Status: {running ? "running" : "paused"}
      </div>
      <div>
        <Button
          onClick={() => {
            store.trigger.tick()
          }}
        >
          Test Tick
        </Button>
      </div>
    </Panel>
  )
}
