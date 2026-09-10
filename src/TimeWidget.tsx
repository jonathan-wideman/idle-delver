import { store } from "./lib/store.new"
import { Button } from "./components/ui/button"
import { saveContext } from "./lib/persistence.new"

export function TimeWidget({
  running,
  toggleRunning,
}: {
  running: boolean
  toggleRunning: (value?: boolean) => void
}) {
  return (
    <div>
      <Button
        onClick={() => {
          toggleRunning()
        }}
        size="icon-xs"
        variant={"ghost"}
      >
        {running ? "⏸️" : "▶️"}
      </Button>
      <Button
        onClick={() => {
          store.trigger.tick()
          saveContext()
        }}
        size="icon-xs"
        variant={"ghost"}
      >
        ⏭️
      </Button>
    </div>
  )
}
