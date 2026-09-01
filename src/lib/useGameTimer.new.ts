import { useCallback, useState } from "react"
import { store } from "./store.new"
import { useInterval } from "usehooks-ts"

// TODO: move delay to state, so we can later implement speedup
export const MS_PER_TICK = 1000

export function useGameTimer(runOnInit: boolean = false) {
  const [running, setRunning] = useState<boolean>(runOnInit)

  const toggleRunning = useCallback(
    (value?: boolean) => {
      const newValue = value ?? !running
      setRunning(newValue)
      if (newValue === true) {
        store.trigger.catchup()
      }
    },
    [running]
  )

  useInterval(
    () => {
      store.trigger.tick()
    },
    // Delay in milliseconds or null to stop it
    running ? MS_PER_TICK : null
  )

  return { running, toggleRunning }
}
