import { useCallback, useEffect, useRef, useState } from "react"

// TODO: WIP
const MS_PER_TICK = 1000

// TODO: WIP
type UseGameTimerOptions = {
  initialRunning?: boolean
  initialTick?: number
  initialLastProcessedMs?: number
  intervalMs?: number
  onTick?: (tick: number) => void
  onLog?: (message: string) => void
}

// TODO: WIP
export default function useGameTimer({
  initialRunning = false,
  initialTick = 0,
  initialLastProcessedMs,
  intervalMs = 1000,
  onTick,
  onLog,
}: UseGameTimerOptions = {}) {
  const [tick, setTick] = useState<number>(initialTick)
  const [running, setRunning] = useState<boolean>(initialRunning)
  const [lastProcessedMs, setLastProcessedMs] = useState<number>(
    initialLastProcessedMs ?? Date.now()
  )

// TODO: WIP
  const onTickRef = useRef(onTick)
  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

// TODO: WIP
  const onLogRef = useRef<((message: string) => void) | undefined>(onLog)
  useEffect(() => {
    onLogRef.current = onLog
  }, [onLog])

// TODO: WIP
  const logMessage = useCallback((message: string) => {
    console.debug(`[GameTimer] ${message}`)
    onLogRef.current?.(message)
  }, [])

// TODO: WIP
  const tickRef = useRef<number>(initialTick)
  useEffect(() => {
    tickRef.current = tick
  }, [tick])

// TODO: WIP
  const runningRef = useRef<boolean>(initialRunning)
  useEffect(() => {
    runningRef.current = running
  }, [running])

// TODO: WIP
  const intervalRef = useRef<number | undefined>(undefined)
// TODO: WIP
  const lastProcessedRef = useRef<number>(
    initialLastProcessedMs ?? Date.now()
  )
  useEffect(() => {
    lastProcessedRef.current = lastProcessedMs
  }, [lastProcessedMs])

// TODO: WIP
  const processElapsedTicks = useCallback(
    (reason: string) => {
      const now = Date.now()
      const previousProcessed = lastProcessedRef.current
      const elapsedMs = now - previousProcessed

      if (elapsedMs < MS_PER_TICK) {
        const message = `${reason}: no missed ticks, elapsed=${elapsedMs}ms, currentTick=${tickRef.current}`
        logMessage(message)
        lastProcessedRef.current = now
        setLastProcessedMs(now)
        return 0
      }

      const missedTicks = Math.floor(elapsedMs / MS_PER_TICK)
      let nextTick = tickRef.current
      const header = `${reason}: processing ${missedTicks} missed tick(s), elapsed=${elapsedMs}ms, startTick=${nextTick}`
      console.groupCollapsed(`[GameTimer] ${header}`)
      logMessage(header)
      for (let i = 1; i <= missedTicks; i += 1) {
        nextTick += 1
        const tickMessage = `${reason} - missed tick ${i}/${missedTicks}: nextTick=${nextTick}`
        logMessage(tickMessage)
        try {
          onTickRef.current?.(nextTick)
        } catch (error) {
          console.error("[GameTimer] onTick error during missed tick", error)
        }
      }
      console.groupEnd()

      setTick(nextTick)
      tickRef.current = nextTick
      lastProcessedRef.current = now
      setLastProcessedMs(now)
      return missedTicks
    },
    [logMessage]
  )

// TODO: WIP
  useEffect(() => {
    if (runningRef.current) {
      const missedTicks = processElapsedTicks("load")
      if (missedTicks > 0) {
        logMessage(`caught up ${missedTicks} tick(s) on load`)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

// TODO: WIP
  useEffect(() => {
    if (!running) {
      if (intervalRef.current !== undefined) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
      return
    }

    if (intervalRef.current !== undefined) {
      return
    }

    intervalRef.current = window.setInterval(() => {
      const next = tickRef.current + 1
      setTick(next)
      tickRef.current = next
      const now = Date.now()
      lastProcessedRef.current = now
      setLastProcessedMs(now)
      logMessage(`interval tick: nextTick=${next}`)
      try {
        onTickRef.current?.(next)
      } catch (error) {
        console.error("[GameTimer] onTick error", error)
      }
    }, intervalMs)

    return () => {
      if (intervalRef.current !== undefined) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
    }
  }, [running, intervalMs, logMessage])

// TODO: WIP
  const pause = useCallback(() => {
    logMessage("paused")
    setRunning(false)
  }, [logMessage])

// TODO: WIP
  const resume = useCallback(() => {
    const missedTicks = processElapsedTicks("resume")
    if (missedTicks > 0) {
      logMessage(`caught up ${missedTicks} tick(s) on resume`)
    }
    logMessage("resumed")
    setRunning(true)
  }, [processElapsedTicks, logMessage])

// TODO: WIP
  const toggle = useCallback(() => {
    if (runningRef.current) {
      pause()
    } else {
      resume()
    }
  }, [pause, resume])

// TODO: WIP
  const resetTimer = useCallback(() => {
    const now = Date.now()
    logMessage("reset timer")
    setTick(0)
    tickRef.current = 0
    lastProcessedRef.current = now
    setLastProcessedMs(now)
  }, [logMessage])

// TODO: WIP
  return {
    tick,
    running,
    lastProcessedMs,
    pause,
    resume,
    toggle,
    resetTimer,
    reset: resetTimer,
    setTick,
  }
}
