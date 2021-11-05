// Global değişkenlerde otomatik tamamlama desteği için.

interface Underline {
  interactions: import("discord.js").Collection<string, import("./types/Interaction") >
  events: import("discord.js").Collection<string, import("./types/Event") >
  config: import("./types/Config");
  client: import("discord.js").Client;
  Interaction: typeof import("./types/Interaction"),
  SlashCommand: typeof import("./types/SlashCommand"),
  MessageAction: typeof import("./types/MessageAction"),
  UserAction: typeof import("./types/UserAction"),
  Event: typeof import("./types/Event"),
  Button: typeof import("./types/Button"),
  SelectMenu: typeof import("./types/SelectMenu"),

  reload(): Promise<any>;

  [key: string | number]: any
}



declare var Underline: Underline;