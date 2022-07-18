// Global değişkenlerde otomatik tamamlama desteği için.

interface Underline {
  interactions: import("discord.js").Collection<import("./generated/ids").InteractionIds, import("./types/Interaction")>
  events: import("discord.js").Collection<import("./generated/ids").EventIds, import("./types/Event") >
  locales: import("discord.js").Collection<import("./types/Locale").LocaleString, import("./generated/localeTypes").default >
  config: import("./types/Config");
  other: { [key: string | number]: any; },
  utils: typeof import("./other/utils.js");
  client: import("discord.js").Client;
  Interaction: typeof import("./types/Interaction"),
  ChatInput: typeof import("./types/ChatInput"),
  MessageAction: typeof import("./types/MessageAction"),
  UserAction: typeof import("./types/UserAction"),
  Event: typeof import("./types/Event"),
  Button: typeof import("./types/Button"),
  SelectMenu: typeof import("./types/SelectMenu"),
  Modal: typeof import("./types/Modal"),
  Locale: typeof import("./types/Locale"),
  plugins: import("./generated/pluginTypes").Types,
  Plugin: typeof import("./types/Plugin"),
  variables: (import("./types/MemoryVariables") | import("./types/RedisVariables")) & {type: "memory"|"redis"},

  reload(): Promise<any>;

  [key: string | number]: any
}

interface Enums {
  ChannelType: typeof import("discord.js").ChannelType,
  MessageType: typeof import("discord.js").MessageType,
  ApplicationCommandOptionType: typeof import("discord.js").ApplicationCommandOptionType,
  ActivityType: typeof import("discord.js").ActivityType,
  AuditLogOptionsType: typeof import("discord.js").AuditLogOptionsType,
  InteractionType: typeof import("discord.js").InteractionType,
  ComponentType: typeof import("discord.js").ComponentType,
  ButtonStyle: typeof import("discord.js").ButtonStyle,
  TextInputStyle: typeof import("discord.js").TextInputStyle,
}


declare var Underline: Underline;
declare var Enums: Enums;