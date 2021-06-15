// Global değişkenlerde otomatik tamamlama desteği için.

declare namespace NodeJS {
  interface Global {
    commands: import("discord.js").Collection<string, import("./types/Command") >
    events: import("discord.js").Collection<string, import("./types/Event") >
    config: import("./types/Config");
    client: import("discord.js").Client;
  }
}