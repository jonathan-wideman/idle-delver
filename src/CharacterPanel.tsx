import { useSelector } from "@xstate/store-react"
import { Panel } from "./components/custom/hoc/Panel"
import { PanelTitle } from "./components/custom/hoc/PanelTitle"
import { store } from "./lib/store.new"
import { MODE, type Character } from "./lib/character.new"
import type { Task } from "./lib/task.new"
import { Button } from "./components/ui/button"

export function CharacterPanel() {
  const character = useSelector(
    store,
    (state) => state.context.characters?.[0]
  ) as Character | undefined
  const task = useSelector(store, (state) =>
    state.context.world.tasks.find(
      (t: Task) => t.id === character?.currentTaskId
    )
  ) as Task | undefined
  return (
    <Panel>
      <PanelTitle>Character Panel</PanelTitle>
      <div>
        {character ? (
          <>
            <div>Name: {character.name}</div>
            <div>
              HP: {character.hp}/{character.maxHp}
            </div>
            <div>
              Skills:
              <ul className="list-outside list-disc pl-8">
                {Object.entries(character.skills).map(([skill, value]) => (
                  <li key={skill} className="-indent-1">
                    {skill}: {value}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              onClick={() => {
                store.trigger.characterChangeMode({
                  characterId: character.id,
                  mode:
                    character.mode === MODE.adventuring
                      ? MODE.resting
                      : MODE.adventuring,
                })
              }}
              disabled={character.mode === MODE.resting && character.hp < 1}
            >
              Go {character.mode === MODE.adventuring ? "Rest" : "Adventure"}
            </Button>{" "}
            <div>Mode: {character.mode}</div>
            <div>Current Task:</div>
            {task ? <TaskPanel task={task} /> : <Panel>None</Panel>}
          </>
        ) : (
          "No character"
        )}
      </div>
    </Panel>
  )
}

export function TaskPanel({ task }: { task: Task }) {
  return (
    <Panel>
      <div>Id: {task.id}</div>
      <div>Name: {task.name}</div>
      <div>Type: {task.type}</div>
      <div>
        Progress: {task.progress}/{task.maxProgress}
      </div>
      <div>
        Challenge: {task.skill} {task.difficulty}
      </div>
    </Panel>
  )
}
