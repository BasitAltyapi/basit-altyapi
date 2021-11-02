import {
  ApplicationCommandChannelOptionData,
  ApplicationCommandChoicesData,
  ApplicationCommandNonOptionsData,
  ApplicationCommandOptionChoice,
  ApplicationCommandOptionData,
  ApplicationCommandType,
  AutocompleteInteraction,
  CacheType,
  Client,
  CommandInteraction,
  ContextMenuInteraction,
  PermissionString,
  SelectMenuInteraction,
  MessageSelectOptionData,
  ButtonInteraction
} from "discord.js";

export type CustomApplicationCommandOptionData = (
    ApplicationCommandNonOptionsData
  | ApplicationCommandChannelOptionData
  | ApplicationCommandChoicesData
) & { onComplete(interaction: AutocompleteInteraction, value: string|number): Promise<ApplicationCommandOptionChoice[]> }

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
  options?: CustomApplicationCommandOptionData[];
  defaultPermission?: boolean;
  actionType?: ApplicationCommandType;
  constructor(arg: TInteractionConstructor)
}

export type TOmittedInteraction = Omit<BaseInteraction, "_type" | "coolDowns" | "name" | "onInteraction" | "actionType" | "options">;
export type TInteractionConstructor = TOmittedInteraction & ((ActionChatCommand | ActionRightClickCommand) & SelectMenu);

export interface IOther {
  setCoolDown(durations: number): void,
  [key: string | number]: any
}

export interface ActionChatCommand {
  name: string[];
  actionType: "CHAT_INPUT";
  onInteraction: (interaction: CommandInteraction, other: IOther) => void;
  options: CustomApplicationCommandOptionData[];
}

export interface ActionRightClickCommand {
  name: string;
  actionType: "MESSAGE" | "USER";
  onInteraction: (interaction: ContextMenuInteraction, other: IOther) => void;
  options: undefined;
}

export interface SelectMenu {
  name: string;
  actionType: "SELECT_MENU";
  onInteraction: (interaction: SelectMenuInteraction, other: IOther) => void;
  options?: MessageSelectOptionData[]
}

export interface Button {
  name: string;
  actionType: "BUTTON";
  onInteraction: (interaction: ButtonInteraction, other: IOther) => void;
  options?: undefined;
}

export = BaseInteraction;