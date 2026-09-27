import { useSelector } from "@xstate/store-react"
import { Panel } from "./components/custom/hoc/Panel"
import { PanelTitle } from "./components/custom/hoc/PanelTitle"
import { store } from "./lib/store.new"
import { MODE, type Character } from "./lib/character.new"
import { formatCardValue, type Card } from "./lib/cards.new"
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
            <div className="mb-2">
              {Object.entries(character.skills).map(([skill, cards]) => (
                <div key={skill}>
                  <div>{skill}</div>
                  <div className="flex flex-wrap gap-1">
                    {cards.map((card, index) => (
                      <CardDisplay key={index} index={index} card={card} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div>
              Mode: {character.mode}{" "}
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
            </div>
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

export function CardDisplay({
  index,
  card,
}: {
  index: number
  card: Card
}): import("react").JSX.Element {
  return (
    <div
      key={index}
      className={twMerge(
        "flex h-14 w-8 flex-col items-center justify-center rounded-sm border bg-accent text-center",
        {
          add: "text-emerald-200",
          subtract: "text-rose-200",
          number: null,
        }[card.type]
      )}
    >
      <div>{card.icon ?? "•"}</div>
      <div>{formatCardValue(card)}</div>
    </div>
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
