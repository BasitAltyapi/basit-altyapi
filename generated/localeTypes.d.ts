export default class Locale {
  locale: import("../types/Locale").LocaleString
  data: LocaleData
}
  
export type LocaleData = {
  userErrors: {
    coolDown: {
      user: (...args) => string,
      member: (...args) => string,
      guild: (...args) => string,
      channel: (...args) => string,
      message: (...args) => string,
      any: (...args) => string
    },
    disabled: (...args) => string,
    blocked: (...args) => string,
    guildOnly: (...args) => string,
    developerOnly: (...args) => string,
    guildOwnerOnly: (...args) => string,
    botPermsRequired: (...args) => string,
    userPermsRequired: (...args) => string
  },
  example: {
    success: (...args) => string,
    error: (...args) => string
  }
};