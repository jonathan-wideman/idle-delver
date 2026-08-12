Start out with these mechanics for now. These will evolve during development so keep the code flexible.

The player may eventually control several hero characters. We will start with one for now.

A character has three main skills: combat, exploration, social. Each skill has an associated die, d6, d8, or d10. A character also has 3 max hp.

Each tick, a character will record progress towards a task determined by context. Each task will need multiple ticks to complete.

While adventuring in a dungeon, a character will progress a random dungeon room task. Each dungeon room task will have a challenge associated with a main skill, and will have a random difficulty. When the progress is complete, the character will roll a die and compare the result to the difficulty. If they meet or exceed the difficulty, reward the player with gold equal to the difficulty. If they fail, the character loses 1 hp. If a character loses all hp, they stop adventuring and must rest.

While resting (ie not in a dungeon), a character will progress a healing task. When the task is complete, they restore 1 hp. They will start a new healing task next tick if they are still injured. If the character has 1 or more hp, the player can opt to send them adventuring to a dungeon.

Make sure to create ui display elements for all this information, and output appropriate debug logs.