
interface Underline {
  commands: import("discord.js").Collection<string, import("./types/Command") >
  events: import("discord.js").Collection<string, import("./types/Event") >
  config: import("./types/Config");
  client: import("discord.js").Client;
  Command: typeof import("./types/Command");
  Event: typeof import("./types/Event");
}

declare var Underline: Underline;