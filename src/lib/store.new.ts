import { createStore } from "@xstate/store-react"
import { MODE, newCharacter, type Character, type Mode } from "./character.new"
import { loadContext } from "./persistence.new"
import { newTask } from "./task.new"
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
      { ...initialTask },
    ],
  },
  player: {
    money: 0,
  },
  characters: [
    {
      ...initialCharacter,
      currentTaskId: initialTask.id,
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

      // TODO: start next task
      // - resting
      // - adventuring

      // TODO: progress task
      // if progress complete:
      //   healing: restore 1 hp
      //   dungeon: roll skill, reward gold or lose hp

      // If hero is down, stop adventuring

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
    gainMoney: (context, event: { amount?: number }) => ({
      ...context,
      player: {
        ...context.player,
        money: context.player.money + (event.amount ?? 0),
      },
    }),
    takeDamage: (context, event: { characterId: string; amount?: number }) => {
      return {
        ...context,
        characters: context.characters.map((c: Character) =>
          c.id === event.characterId
            ? { ...c, hp: Math.max(0, c.hp - (event.amount ?? 0)) }
            : c
        ),
      }
    },
    changeHeroMode: (context, event: { characterId: string; mode: Mode }) => {
      const character = context.characters.find(
        (c: Character) => c.id === event.characterId
      )

      // Prevent adventuring at zero hp
      if (event.mode === MODE.adventuring && character?.hp < 1) {
        return context
      }

      // TODO: do we need to assign hero a task, or just wait for next tick?

      return {
        ...context,
        characters: context.characters.map((c: Character) =>
          c.id === event.characterId ? { ...c, mode: event.mode } : c
        ),
      }
    },
    resetContext: () => {
      return { ...initialContext }
    },
  },
})
