import { useSelector } from "@xstate/store-react"
import { Panel } from "./components/custom/hoc/Panel"
import { PanelTitle } from "./components/custom/hoc/PanelTitle"
import { store } from "./lib/store.new"
import { formatCard, MODE, type Character } from "./lib/character.new"
import type { Task } from "./lib/task.new"
import { Button } from "./components/ui/button"
import { twMerge } from "tailwind-merge"

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
              HP:{" "}
              {[...new Array(character.maxHp)].map((_, i) => (
                <span key={i}>{i < character.hp ? "❤️" : "🖤"}</span>
              ))}{" "}
              {character.hp}/{character.maxHp}{" "}
              <Button
                onClick={() => {
                  store.trigger.characterTakeDamage({
                    characterId: character.id,
                    amount: 1,
                  })
                }}
              >
                Damage
              </Button>
              <Button
                onClick={() => {
                  store.trigger.characterHeal({
                    characterId: character.id,
                    amount: 1,
                  })
                }}
              >
                Heal
              </Button>
            </div>
            <div>
              Skills:
              <ul className="list-outside list-disc pl-8">
                {Object.entries(character.skills).map(([skill, values]) => (
                  <li key={skill} className="-indent-1">
                    {skill}:{" "}
                    {values.map((card, index) => (
                      <span
                        key={index}
                        className={twMerge(
                          "my-0.5 mr-1 inline-block h-8 w-6 rounded-sm border bg-accent text-center",
                          {
                            add: "text-emerald-200",
                            subtract: "text-rose-200",
                            number: null,
                          }[card.type]
                        )}
                      >
                        {formatCard(card)}
                      </span>
                    ))}
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
