import { useSelector } from "@xstate/store-react"
import { store } from "./lib/store.new"

export function PlayerWidget() {
  const money = useSelector(
    store,
    (state) => state.context.player.money
  ) as number
  const ether = useSelector(
    store,
    (state) => state.context.player.ether
  ) as number

  return (
    <div className="flex gap-1">
      <span>🪙{formatLargeNumber(money)}</span>
      <span>⏳{formatLargeNumber(ether)}</span>
    </div>
  )
}

// NB. Number.MAX_SAFE_INTEGER === 9007199254740991
function formatLargeNumber(value: number) {
  if (value >= 1000000000000) {
    return `${(value / 1000000000000).toFixed(2)}T`
  }
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`
  }
  return value
}
