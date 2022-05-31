class Plugin {
  name: string;

  version: string;

  namespace: string;

  locale: Object;
  
  requires?: {
    modules?: {
      [key: string]: string
    },
    plugins?: string[],
    config?: { [key: string]: any },
  }

  implements?: {
    events?: {
      [key: string]: string
    },
    properties?: {
      [key: string]: "number"|"string"|"function"|"array"|"boolean"|string
    }
  }

  onLoad(api: PluginAPI): void;

  constructor(obj: Plugin): Plugin;
}

export class PluginAPI {
  define(name: string, value: any): void;
  emit(name: string, ...args: any[]): void;
  setPluginReady(): void;

  onInteractionBeforeChecks(cb: (uInter: import("./Interaction"), interaction: import("discord.js").Interaction, other: import("./Interaction").IOther) => boolean): void;
  onInteraction(cb: (uInter: import("./Interaction"), interaction: import("discord.js").Interaction, other: import("./Interaction").IOther)=>boolean): void;
  onAfterInteraction(cb: (uInter: import("./Interaction"), interaction: import("discord.js").Interaction, other: import("./Interaction").IOther) => any): void;
  
  onEvent(cb: (eventName: import("./Event").TEventNames, args: any[], other: import("./Event").IOther) => boolean): void;
  onAfterEvent(cb: (eventName: import("./Event").TEventNames, args: any[], other: import("./Event").IOther) => any): void;

  onBotReady(cb: (client: import("discord.js").Client) => any): void;

  client: import("discord.js").Client;
}

export = Plugin;