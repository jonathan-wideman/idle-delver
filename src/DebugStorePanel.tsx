import { Panel } from "./components/custom/hoc/Panel"
import { PanelTitle } from "./components/custom/hoc/PanelTitle"
import { Button } from "./components/ui/button"
import { clearSavedContext, saveContext } from "./lib/persistence.new"
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
        <Button onClick={() => {
          saveContext()
        }}>
          Save Context
        </Button>
        <Button onClick={() => {
          clearSavedContext()
        }}>
          Clear Saved Context
        </Button>
      </div>
    </Panel>
  )
}
