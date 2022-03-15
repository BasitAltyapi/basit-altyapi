# Simple Infrastructure (Version 1.9.9) (v13.x)

A discord bot infrastructure that is simple to use but has many features. It receives frequent updates. (Slash Commands)
 
## Features

- ✅ **Multi-language support.**
- ✅ **Server specific command sharing types.**
- ✅ **SelectMenu and Button support.**
- ✅ **SelectMenu and Button full component and options support.**
- ✅ **Autocomplate support.**
- ✅ **Right menu support.**
- ✅ **Slash command support.**
- ✅ **Slash subcommand support.**
- ✅ **Slash subcommandgroup support.**
- ✅ Async and super fast. `(takes about 1ms per interaction.)`
- ✅ _variable_ slowdown support per interaction.
- ✅ Per interaction bot required authorization support.
- ✅ user required authorization support per interaction.
- ✅ Customizable error messages.
- ✅ Logic error warning systems.
- ✅ User ban from bot.
- ✅ autocomplete in interactions.
- ✅ Global `Underline` object. (interactions, events, config, client, etc.)
- ✅ Nested folder support.
- ✅ interactive on/off support.
- ✅ Interaction support available only to developers.
- ✅ General event support.
- ✅ Event autocomplete support.
- ✅ Ability to close events.
- ✅ Advanced config file. You don't need to modify the `index.js` file at all.
- ✅ Ability to change interaction defaults.
- ✅ Ability to add pre-interaction transactions easily.
- ✅ Easily create interaction or event infrastructure.
- ✅ Easy file deactivation. Interactions and events beginning with a hyphen (-) are ignored.
- ✅ Ability to move value/reference in Button and Select menus.
- ✅ Ability to specify a value before each operation with the Other object.
- ✅ Fully automatic language support. Automatic detection of the language of the person using the command.

## Installation

### Download
- Latest version of the infrastructure [download here](https://github.com/TheArmagan/basit-altyapi/releases/latest)

### Requirements
- Node.js; `v16.6.1` or higher. I tested it in `v16.6.1` version. You can download it from Node.js' own site.
- Yarn; Yarn is 8-10 times faster and problem-solving than the package manager npm I use. To install it, simply type `npm install -g yarn` in your console.

### Setup
- It is enough to go to the project file location and write `yarn install`.
- After [install](#installation) the project, you can start the project by typing `node index.js`.

### Installation
- You can carefully read the [`config.js`](./config.js) config file and adjust the bot's general settings to edit user error messages and other events.
- For interactions, you can carefully read the [`ornekKomut.js`](./interactions/-ornekKomut.js) and [`-ornekSağtık.js`](./interactions/-ornekSağtık.js) file inside the `interactions` folder.
- If you want to create a new interaction file, you can use the `yarn interaksiyon` interaction. In this way, it will save you the trouble of writing the first interaction infrastructure and will ask all kinds of questions about the interaction.

- You can use `node publishInteractions.js global` to publish Slash interactions globally on discord or `node publishInteractions.js guild <guildId>` if you want to publish only for a server. Global interactions can take up to 1 hour to arrive on the servers. On the contrary, interactions with the server come within 5 to 10 seconds. *Note: While testing your bot, I recommend debugging using server interactions as opposed to global interactions. Because if you post global interactions as spam, you can drop ratelimit.*
- You can use `node publishInteractions.js global clear` or `node publishInteractions.js guild <guildId> clear` interaction to clear all interactions.


- For events, you can carefully read the file [`-ornekOlay.js`](./events/-ornekOlay.js) inside the `events` folder.
- If you want to create a new event file, you can use the `yarn olay` interaction. In this way, it will save you the trouble of writing the first event infrastructure and will ask all kinds of questions about the event.

## Update

- When updating, all you need to do is replace the `types folder`, `other folder`, `index.js file`, `package.json file` with the old one.

## Help

- If you've read everything here but don't understand anything, you can watch our series [Simple Infrastructure Guide](https://www.youtube.com/watch?v=bQ9ZLpfyCyY&list=PLONuYdOGaaL3m705lBXLAp2okk0TE5EiO) designed for idiots.
- You can join my discord server for help and get help from me: https://discord.gg/CFbGS6kXfD
