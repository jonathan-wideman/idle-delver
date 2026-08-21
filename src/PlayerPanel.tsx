import { useSelector } from "@xstate/store-react"
import { Panel } from "./components/custom/hoc/Panel"
import { PanelTitle } from "./components/custom/hoc/PanelTitle"
import { store } from "./lib/store.new"

export function PlayerPanel() {
  const money = useSelector(store, (state) => state.context.player.money) as number

  return (
    <Panel>
      <PanelTitle>Player Panel</PanelTitle>
      <div>Gold: {money}</div>
    </Panel>
  )
}
