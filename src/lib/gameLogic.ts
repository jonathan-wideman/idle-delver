import { type GameSkill, type GameTask, type HeroState } from "./gameState"

// DONE
const skillDice: Record<GameSkill, number> = {
  combat: 6,
  exploration: 8,
  social: 10,
}

// DONE
const skills: GameSkill[] = ["combat", "exploration", "social"]

// DONE
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// DONE
function randomSkill(): GameSkill {
  return skills[randomInt(0, skills.length - 1)]
}

// DONE
export function createDungeonTask(): GameTask {
  const skill = randomSkill()
  return {
    type: "dungeon",
    skill,
    requiredTicks: randomInt(2, 4),
    progress: 0,
    difficulty: randomInt(2, 10),
  }
}

// DONE
export function createHealingTask(): GameTask {
  return {
    type: "healing",
    skill: null,
    requiredTicks: 3,
    progress: 0,
    difficulty: null,
  }
}

// DONE
export function startAdventuring(hero: HeroState): HeroState {
  if (hero.hp < 1 || hero.mode === "adventuring") {
    return hero
  }

  return {
    ...hero,
    mode: "adventuring",
    // DONE: OMIT - just wait for next tick
    currentTask: createDungeonTask(),
  }
}

// DONE
export function stopAdventuring(hero: HeroState): HeroState {
  if (hero.mode === "resting") {
    return hero
  }

  return {
    ...hero,
    mode: "resting",
    currentTask: null,
  }
}

// DONE
export function advanceHeroTick(
  hero: HeroState,
  appendLog: (message: string) => void
) {
  let nextHero = hero
  let goldDelta = 0

  // DONE
  if (!nextHero.currentTask) {
    if (nextHero.mode === "adventuring") {
      const nextTask = createDungeonTask()
      appendLog(
        `Started dungeon task: ${nextTask.skill} (${nextTask.requiredTicks} ticks, difficulty ${nextTask.difficulty})`
      )
      nextHero = {
        ...nextHero,
        currentTask: nextTask,
      }
    } else if (nextHero.mode === "resting" && nextHero.hp < nextHero.maxHp) {
      const healingTask = createHealingTask()
      appendLog(
        `Started healing task: ${healingTask.requiredTicks} ticks to restore 1 HP`
      )
      nextHero = {
        ...nextHero,
        currentTask: healingTask,
      }
    } else {
      return { hero: nextHero, goldDelta }
    }
  }

  // DONE
  const task = nextHero.currentTask
  if (!task) {
    return { hero: nextHero, goldDelta }
  }

  // DONE
  const progress = task.progress + 1
  const updatedTask = { ...task, progress }

  // DONE
  if (progress < task.requiredTicks) {
    appendLog(
      `Progressed ${task.type} task: ${progress}/${task.requiredTicks} tick(s)`
    )
    nextHero = {
      ...nextHero,
      currentTask: updatedTask,
    }
    return { hero: nextHero, goldDelta }
  }

  // DONE
  if (task.type === "healing") {
    const newHp = Math.min(nextHero.maxHp, nextHero.hp + 1)
    appendLog(`Healing complete: restored 1 HP (${nextHero.hp} → ${newHp})`)
    nextHero = {
      ...nextHero,
      hp: newHp,
      currentTask: null,
    }
    return { hero: nextHero, goldDelta }
  }

  // DONE
  const skill = task.skill!
  const die = skillDice[skill]
  const roll = randomInt(1, die)
  const difficulty = task.difficulty ?? 0
  appendLog(
    `Dungeon task complete: rolled ${roll} on d${die} vs difficulty ${difficulty}`
  )

  // DONE
  if (roll >= difficulty) {
    goldDelta = difficulty
    appendLog(`Success! Earned ${difficulty} gold.`)
    nextHero = {
      ...nextHero,
      currentTask: null,
    }
    return { hero: nextHero, goldDelta }
  }

  // DONE
  const nextHp = nextHero.hp - 1
  appendLog(`Failed challenge: lost 1 HP (${nextHero.hp} → ${nextHp})`)

  // DONE
  if (nextHp <= 0) {
    appendLog("Hero is down and returns to resting.")
    nextHero = {
      ...nextHero,
      hp: 0,
      mode: "resting",
      currentTask: null,
    }
    return { hero: nextHero, goldDelta }
  }

  // DONE
  nextHero = {
    ...nextHero,
    hp: nextHp,
    currentTask: null,
  }
  appendLog("Hero continues adventuring with a new task next tick.")
  return { hero: nextHero, goldDelta }
}
