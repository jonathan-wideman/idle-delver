import { useCallback, useEffect, useRef, useState } from "react"

// DONE
const MS_PER_TICK = 1000

// DONE: OMIT
type UseGameTimerOptions = {
  initialRunning?: boolean
  initialTick?: number
  initialLastProcessedMs?: number
  intervalMs?: number
  onTick?: (tick: number) => void
  onLog?: (message: string) => void
}

// DONE
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
  // DONE 
  const [lastProcessedMs, setLastProcessedMs] = useState<number>(
    initialLastProcessedMs ?? Date.now()
  )

  // DONE: OMIT
  const onTickRef = useRef(onTick)
  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  // DONE: OMIT
  const onLogRef = useRef<((message: string) => void) | undefined>(onLog)
  useEffect(() => {
    onLogRef.current = onLog
  }, [onLog])

  // DONE: OMIT
  const logMessage = useCallback((message: string) => {
    console.debug(`[GameTimer] ${message}`)
    onLogRef.current?.(message)
  }, [])

  // DONE: OMIT
  const tickRef = useRef<number>(initialTick)
  useEffect(() => {
    tickRef.current = tick
  }, [tick])

  // DONE: OMIT
  const runningRef = useRef<boolean>(initialRunning)
  useEffect(() => {
    runningRef.current = running
  }, [running])

  // DONE: OMIT
  const intervalRef = useRef<number | undefined>(undefined)
  // DONE: OMIT
  const lastProcessedRef = useRef<number>(
    initialLastProcessedMs ?? Date.now()
  )
  useEffect(() => {
    lastProcessedRef.current = lastProcessedMs
  }, [lastProcessedMs])

  // DONE
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

  // DONE
  useEffect(() => {
    if (runningRef.current) {
      const missedTicks = processElapsedTicks("load")
      if (missedTicks > 0) {
        logMessage(`caught up ${missedTicks} tick(s) on load`)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // DONE
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

  // DONE
  const pause = useCallback(() => {
    logMessage("paused")
    setRunning(false)
  }, [logMessage])

  // DONE
  const resume = useCallback(() => {
    // DONE
    const missedTicks = processElapsedTicks("resume")
    if (missedTicks > 0) {
      logMessage(`caught up ${missedTicks} tick(s) on resume`)
    }
    logMessage("resumed")
    setRunning(true)
  }, [processElapsedTicks, logMessage])

  // DONE
  const toggle = useCallback(() => {
    if (runningRef.current) {
      pause()
    } else {
      resume()
    }
  }, [pause, resume])

  // DONE
  const resetTimer = useCallback(() => {
    const now = Date.now()
    logMessage("reset timer")
    setTick(0)
    tickRef.current = 0
    lastProcessedRef.current = now
    setLastProcessedMs(now)
  }, [logMessage])

  // DONE
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
