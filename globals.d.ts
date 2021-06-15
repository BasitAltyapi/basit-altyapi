// Global değişkenlerde otomatik tamamlama desteği için.

declare namespace NodeJS {
  interface Global {
    commands: import("discord.js").Collection<string, import("./types/Command")>
    config: import("./types/Config");
  }
}