import {
  ApplicationCommandOptionData,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  ContextMenuInteraction,
  PermissionString
} from "discord.js";

export class BaseInteraction {
  private _type: string;
  name: string[];
  id?: string;
  perms?: { bot: PermissionString[], user: PermissionString[] };
  onInteraction: (interaction: CommandInteraction | ContextMenuInteraction, other: IOther ) => void;
  onLoad?(client: Client): void;
  coolDowns: Map<string, number>;
  description!: string;
  disabled?: boolean;
  developerOnly?: boolean;
  other?: { [key: string | number]: any };
  coolDown?: number;
  guildOnly?: boolean;
  options?: ApplicationCommandOptionData[];
  defaultPermission?: boolean;
  actionType?: ApplicationCommandType;
  constructor(arg: TInteractionConstructor)
}

export type TOmittedInteraction = Omit<BaseInteraction, "_type" | "coolDowns" | "name" | "onInteraction" | "actionType">;
export type TInteractionConstructor = TOmittedInteraction & (SlashCommand & (ActionChatCommand | ActionRightClickCommand));

export interface IOther {
  setCoolDown(durations: number): void,
  [key: string | number]: any
}

export interface ActionChatCommand {
  actionType: "CHAT_INPUT";
  onInteraction: (interaction: CommandInteraction, other: IOther) => void;
}

export interface ActionRightClickCommand {
  actionType: "MESSAGE" | "USER";
  onInteraction: (interaction: ContextMenuInteraction, other: IOther) => void;
}

export interface SlashCommand {
  actionType: "CHAT_INPUT";
  name: string[];
}

export = BaseInteraction;