import { useState } from "react"
import { store } from "./store.new"

const MS_PER_TICK = 1000

// export default function useGameTimer({ runOnInit = false }: { runOnInit?: boolean }) {
export function useGameTimer() {
    const [running, setRunning] = useState<boolean>(false)
    // const [running, setRunning] = useState<boolean>(runOnInit)
    return { running, setRunning }

    useEffect(() => {
        setTimeout(() => {
            store.trigger.tick()
        }, MS_PER_TICK)
    }, [])
}