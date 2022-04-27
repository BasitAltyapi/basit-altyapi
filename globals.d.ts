// Global değişkenlerde otomatik tamamlama desteği için.

interface Underline {
  interactions: import("discord.js").Collection<import("./generated/ids").InteractionIds, import("./types/Interaction")>
  events: import("discord.js").Collection<import("./generated/ids").EventIds, import("./types/Event") >
  locales: import("discord.js").Collection<import("./types/Locale").LocaleString, import("./types/Locale") >
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

  reload(): Promise<any>;

  [key: string | number]: any
}



declare var Underline: Underline;