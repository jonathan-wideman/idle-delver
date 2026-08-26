import { useSelector } from "@xstate/store-react"
import { Panel } from "./components/custom/hoc/Panel"
import { PanelTitle } from "./components/custom/hoc/PanelTitle"
import { store, type LogEntry } from "./lib/store.new"
import { useMemo, useState } from "react"
import { Button } from "./components/ui/button"

export function LogsPanel() {
  const logs = useSelector(
    store,
    (state) => state.context.meta.logs
  ) as LogEntry[]
  const [showTimeMs, setShowTimeMs] = useState(false)

  const recentLogs = useMemo(() => logs.slice(-20).toReversed(), [logs])
  const logLines = useMemo(
    () =>
      recentLogs.map((line, index) => (
        <div key={`${index}-${line}`}>
          <span className="text-xs text-muted-foreground">
            {new Date(line.timestamp).toLocaleTimeString()}
          </span>{" "}
          {showTimeMs && (
            <span className="text-xs text-muted-foreground">
              ({line.timestamp})
            </span>
          )}
          <span className="text-xs text-muted-foreground"> • </span>
          {line.message}
        </div>
      )),
    [recentLogs, showTimeMs]
  )

  return (
    <Panel>
      <PanelTitle>Logs Panel</PanelTitle>
      <Button onClick={() => setShowTimeMs(!showTimeMs)}>
        {showTimeMs ? "Hide" : "Show"} MS
      </Button>
      <Button
        onClick={() => {
          store.trigger.log({ level: "info", message: "test log" })
        }}
      >
        Test Log
      </Button>{" "}
      <Button
        onClick={() => {
          store.trigger.clearLogs()
        }}
      >
        Clear Logs
      </Button>{" "}
      {logLines}
      {/* TODO: clear logs display - offset display index?*/}
      {/* TODO: log priority & filter by priority; info vs warning vs error, etc*/}
    </Panel>
  )
}
