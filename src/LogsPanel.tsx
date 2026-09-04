import { useSelector } from "@xstate/store-react"
import { Panel } from "./components/custom/hoc/Panel"
import { PanelTitle } from "./components/custom/hoc/PanelTitle"
import {
  LOG_LEVEL,
  LOG_LEVELS,
  store,
  type LogEntry,
  type LogLevel,
} from "./lib/store.new"
import { useMemo, useState } from "react"
import { Button } from "./components/ui/button"

export function LogsPanel() {
  const logs = useSelector(
    store,
    (state) => state.context.meta.logs
  ) as LogEntry[]
  const [showDetails, setShowDetails] = useState(false)
  const [showTimeMs, setShowTimeMs] = useState(false)
  const [filterMinLevel, setFilterMinLevel] = useState<LogLevel>(
    LOG_LEVEL.gameplay
  )

  const filteredLogs = useMemo(() => {
    // TODO: extract log level comparison
    const filterMinLevelIndex = LOG_LEVELS.indexOf(filterMinLevel)
    return logs.filter(
      (log) => LOG_LEVELS.indexOf(log.level) >= filterMinLevelIndex
    )
  }, [logs, filterMinLevel])
  const recentLogs = useMemo(
    () => filteredLogs.slice(-20).toReversed(),
    [filteredLogs]
  )
  const logLines = useMemo(
    () =>
      recentLogs.map((line, index) => (
        <div key={`${index}-${line}`}>
          {showDetails && (
            <>
              <span className="text-xs text-muted-foreground">
                {new Date(line.timestamp).toLocaleTimeString()}
              </span>{" "}
              {showTimeMs && (
                <span className="text-xs text-muted-foreground">
                  ({line.timestamp})
                </span>
              )}
              <span className="text-xs text-muted-foreground"> • </span>
              <span className="rounded-sm bg-muted px-1.25 text-xs text-muted-foreground uppercase">
                {line.level}
              </span>
            </>
          )}{" "}
          {line.message}
        </div>
      )),
    [recentLogs, showDetails, showTimeMs]
  )

  return (
    <Panel>
      <PanelTitle>Logs Panel</PanelTitle>
      <div>
        <Button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide" : "Show"} Details
        </Button>
        <Button onClick={() => setShowTimeMs(!showTimeMs)}>
          {showTimeMs ? "Hide" : "Show"} MS
        </Button>
        <Button
          onClick={() => {
            store.trigger.log({ level: LOG_LEVEL.debug, message: "test log" })
          }}
        >
          Test Log
        </Button>
        <Button
          onClick={() => {
            store.trigger.clearLogs()
          }}
        >
          Clear Logs
        </Button>
      </div>
      <div>
        <span className="text-xs text-muted-foreground">Show logs above:</span>
        <select
          value={filterMinLevel}
          onChange={(e) => setFilterMinLevel(e.target.value as LogLevel)}
        >
          {LOG_LEVELS.map((level) => (
            <option
              key={level}
              value={level}
              className="text-accent capitalize"
            >
              {level}
            </option>
          ))}
        </select>
      </div>
      {logLines}
      {/* TODO: clear logs display - offset display index?*/}
      {/* TODO: log priority & filter by priority; info vs warning vs error, etc*/}
    </Panel>
  )
}
