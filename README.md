# [22w07a|1.18.1] mcfunction language support for atom

## Info
This is a fork of https://github.com/Bassab03/mcfunction (orignal author: [Yurihaia](https://github.com/Yurihaia)). I have not created the base of this package, all the credits for that goes to Yurihaia, but I know how to edit the package to support the newest commands and items and I will also add quality of life changes. My goal is to keep the package up to date with the latest snapshots.

## Features
- Syntax highlighting
- Autocomplete for commands and selectors
  - Working autocomplete for irregular particles (minecraft:block, minecraft:block_marker, minecraft:dust, minecraft:item)
- Version switching (starting from 1.16.5)
- Updated lists for:
  - Advancements
  - Blocks
  - Effects
  - Enchantments
  - Entities
  - Items
  - Loottables
  - Particles
  - Recipes
  - Scoreboard objectives
  - Sounds
  - etc.

## Common "Issues"
### The syntax highlighting stops working in long commands (especially tellraw)
This behavior is not a bug. It is a result of atom's token limit. You can increase the token limit with this [pack](https://atom.io/packages/grammar-token-limit).\
But keep in mind increasing the token limit can impact performance.

### The /replaceitem command is not working correctly
That's because in 1.17 the /replaceitem command was replaced with the /item command. But you can change the version to 1.16 in the package settings in order to use the /replaceitem command again.
