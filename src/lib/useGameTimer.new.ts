import { useCallback, useState } from "react"
import { store } from "./store.new"
import { useInterval } from "usehooks-ts"

// TODO: move delay to state, so we can later implement speedup
const MS_PER_TICK = 1000

// export default function useGameTimer({ runOnInit = false }: { runOnInit?: boolean }) {
export function useGameTimer() {
  const [running, setRunning] = useState<boolean>(false)
  // TODO: option for init
  // const [running, setRunning] = useState<boolean>(runOnInit)

  // TODO: trigger catchup ticks on upause

  const toggleRunning = useCallback(
    (value?: boolean) => {
      setRunning(value ?? !running)
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
