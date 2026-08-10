import { useCallback, useEffect, useRef, useState } from "react"

type UseGameTimerOptions = {
  initialRunning?: boolean
  initialTick?: number
  intervalMs?: number
  onTick?: (tick: number) => void
}

export default function useGameTimer({
  initialRunning = false,
  initialTick = 0,
  intervalMs = 1000,
  onTick,
}: UseGameTimerOptions = {}) {
  const [tick, setTick] = useState<number>(initialTick)
  const [running, setRunning] = useState<boolean>(initialRunning)

  const onTickRef = useRef(onTick)
  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  const tickRef = useRef<number>(initialTick)
  useEffect(() => {
    tickRef.current = tick
  }, [tick])

  const intervalRef = useRef<number | undefined>(undefined)

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
      try {
        onTickRef.current?.(next)
      } catch (e) {
        // swallow callback errors to avoid breaking the timer
      }
    }, intervalMs)

    return () => {
      if (intervalRef.current !== undefined) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
    }
  }, [running, intervalMs])

  const pause = useCallback(() => setRunning(false), [])
  const resume = useCallback(() => setRunning(true), [])
  const toggle = useCallback(() => setRunning((r) => !r), [])
  const resetTimer = useCallback(() => setTick(0), [])

  return {
    tick,
    running,
    pause,
    resume,
    toggle,
    resetTimer,
    reset: resetTimer,
    setTick,
  }
}
