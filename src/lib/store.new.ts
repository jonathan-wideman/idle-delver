import { createStore } from "@xstate/store-react"
import { MODE, newCharacter, type Character, type Mode } from "./character.new"
import { loadContext } from "./persistence.new"
import { newTask, TASK_TYPE, type Task } from "./task.new"
import { MS_PER_TICK } from "./useGameTimer.new"

// TODO: extract logs stuff
// export type LogLevel = "debug" | "info" | "gameplay" | "warning" | "error"
export const LOG_LEVEL = {
  debug: "debug",
  info: "info",
  gameplay: "gameplay",
  warning: "warning",
  error: "error",
} as const
export const LOG_LEVELS = Object.keys(LOG_LEVEL) as LogLevel[]
export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL]
export interface LogEntry {
  level: LogLevel
  timestamp: number
  message: string
}

const startupTime = Date.now()
// TODO: no initial task
const initialCharacter = newCharacter()
const initialTask = newTask("dungeon")
// TODO: we never save state, so we never load it
const initialContext = loadContext() ?? {
  meta: {
    time: {
      ticks: 0,
      lastTickAt: startupTime,
      // TODO: may need to handle timer state outside store
      // paused: false, // PAUSED but will still accumulate catchup ticks
      // stopped: false, // will not accumulate catchup ticks
    },
    logs: [
      // TODO: move to startup script
      {
        level: LOG_LEVEL.gameplay,
        message: "Game started",
        timestamp: startupTime,
      },
    ] as LogEntry[],
  },
  world: {
    tasks: [
      // TODO: no initial task
      // { ...initialTask },
    ],
  },
  player: {
    money: 0,
  },
  characters: [
    {
      ...initialCharacter,
      // currentTaskId: initialTask.id,
    },
  ],
}

export const store = createStore({
  context: { ...initialContext },
  on: {
    // TODO: make log accept arbitrary message, like console.log
    log: (context, event: { level: LogLevel; message: string }) => {
      const log = {
        level: event.level,
        timestamp: Date.now(),
        message: event.message,
      }
      console.log(log)
      return {
        ...context,
        meta: {
          ...context.meta,
          logs: [...context.meta.logs, log],
        },
      }
    },
    clearLogs: (context) => ({
      ...context,
      meta: {
        ...context.meta,
        logs: [],
      },
    }),
    resetTime: (context) => ({
      ...context,
      meta: {
        ...context.meta,
        time: {
          ...context.meta.time,
          ticks: 0,
          lastTickAt: Date.now(),
        },
      },
    }),
    catchup: (context, _event, enq) => {
      const deltaTime = Date.now() - context.meta.time.lastTickAt
      const deltaTicks = Math.floor(deltaTime / MS_PER_TICK)
      enq.trigger.log({
        level: LOG_LEVEL.gameplay,
        message: `(Not yet implemented) catchup ${deltaTicks} ticks`,
      })
      // TODO: do catchup ticks
      // for (let i = 0; i < deltaTicks; i++) {
      //   enq.trigger.tick()
      // }
      // enq.trigger.log({
      //   level: LOG_LEVEL.gameplay,
      //   level: "info" as LogLevel,
      //   message: `Finished ${deltaTicks} catchup ticks`,
      // })
      return { ...context }
    },
    // TODO: maybe ticks should be outside the game store?
    tick: (context, _event, enq) => {
      const currentTime = Date.now()

      enq.trigger.log({ level: LOG_LEVEL.debug, message: "tick" })

      // FIXME: support multiple characters
      const character = context.characters[0]

      if (!character.currentTaskId) {
        // if the character doesn't have a task, start a new one
        enq.trigger.newCharacterTask({ characterId: context.characters[0].id })
      }

      // TODO: progress task
      // if the hero has a task
      //   if task complete:
      //     healing: restore 1 hp
      //     dungeon: roll skill, reward gold or lose hp
      //   else apply progress

      if (character.hp <= 0 && character.mode === MODE.adventuring) {
        // if the character is down, stop adventuring
        enq.trigger.log({
          level: LOG_LEVEL.gameplay,
          message: `${character.name} is down`,
        })
        enq.trigger.characterChangeMode({
          characterId: character.id,
          mode: MODE.resting,
        })
      }

      return {
        ...context,
        meta: {
          ...context.meta,
          time: {
            ...context.meta.time,
            ticks: context.meta.time.ticks + 1,
            lastTickAt: currentTime,
          },
        },
      }
    },
    newCharacterTask: (context, event: { characterId: string }, enq) => {
      const character = context.characters.find(
        (c: Character) => c.id === event.characterId
      )
      if (!character) {
        enq.trigger.log({
          level: LOG_LEVEL.warning,
          message: `No character with id ${event.characterId}`,
        })
        return context
      }
      const taskType =
        character.mode === MODE.adventuring
          ? TASK_TYPE.dungeon
          : TASK_TYPE.healing

      if (taskType === TASK_TYPE.healing && character.hp === character.maxHp) {
        enq.trigger.log({
          level: LOG_LEVEL.debug,
          message: `${character.name} is already fully healed`,
        })
        return context
      }
      const task = newTask(taskType)

      enq.trigger.log({
        level: LOG_LEVEL.gameplay,
        message: `${character.name} started ${task.name}`,
      })

      // TODO: also drop existing task?
      return {
        ...context,
        characters: context.characters.map((c: Character) =>
          c.id === event.characterId ? { ...c, currentTaskId: task.id } : c
        ),
        world: {
          ...context.world,
          tasks: [...context.world.tasks, task],
        },
      }
    },
    gainMoney: (context, event: { amount?: number }) => ({
      ...context,
      player: {
        ...context.player,
        money: context.player.money + (event.amount ?? 0),
      },
    }),
    characterTakeDamage: (
      context,
      event: { characterId: string; amount?: number },
      enq
    ) => {
      const character = context.characters.find(
        (c: Character) => c.id === event.characterId
      )
      // TODO: only log if hp actually changed
      enq.trigger.log({
        level: LOG_LEVEL.gameplay,
        message: `${character?.name} took ${event.amount} damage`,
      })
      return {
        ...context,
        characters: context.characters.map((c: Character) =>
          c.id === event.characterId
            ? { ...c, hp: Math.max(0, c.hp - (event.amount ?? 0)) }
            : c
        ),
      }
    },
    characterHeal: (
      context,
      event: { characterId: string; amount?: number },
      enq
    ) => {
      const character = context.characters.find(
        (c: Character) => c.id === event.characterId
      )
      // TODO: only log if hp actually changed
      enq.trigger.log({
        level: LOG_LEVEL.gameplay,
        message: `${character?.name} healed ${event.amount} hp`,
      })
      return {
        ...context,
        characters: context.characters.map((c: Character) =>
          c.id === event.characterId
            ? { ...c, hp: Math.min(c.maxHp, c.hp + (event.amount ?? 0)) }
            : c
        ),
      }
    },
    characterChangeMode: (
      context,
      event: { characterId: string; mode: Mode }
    ) => {
      const character = context.characters.find(
        (c: Character) => c.id === event.characterId
      )

      // TODO: logs?

      // Prevent adventuring at zero hp
      if (event.mode === MODE.adventuring && character?.hp < 1) {
        return context
      }

      return {
        ...context,
        characters: context.characters.map((c: Character) =>
          c.id === event.characterId
            ? {
                ...c,
                mode: event.mode,
                // reset current task when changing mode
                currentTaskId: null,
              }
            : c
        ),
        world: {
          ...context.world,
          // delete current task when changing mode
          tasks: context.world.tasks.filter(
            (t: Task) => t.id !== character?.currentTaskId
          ),
        },
      }
    },
    resetContext: () => {
      return { ...initialContext }
    },
  },
})
