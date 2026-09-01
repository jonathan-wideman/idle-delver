import { Panel } from "./components/custom/hoc/Panel"
import { PanelTitle } from "./components/custom/hoc/PanelTitle"
import { Button } from "./components/ui/button"
import { store } from "./lib/store.new"

export function DebugStorePanel() {
  return (
    <Panel>
      <PanelTitle>Debug Store Panel</PanelTitle>
      {/* TODO: debug persistence */}
      <div>
        <Button
          onClick={() => {
            store.trigger.resetContext()
          }}
        >
          Reset Context
        </Button>
      </div>
    </Panel>
  )
}
