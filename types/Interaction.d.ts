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
  ButtonInteraction,
  MessageSelectMenu,
  MessageButton,
  MessageButtonStyleResolvable,
  EmojiResolvable
} from "discord.js";

interface CustomSelectMenuOptions {
  min?: number;
  max?: number;
  choices: MessageSelectOptionData[];
  placeholder?: string;
}

interface CustomButtonOptions {
  emoji?: EmojiResolvable;
  label?: string;
  style: MessageButtonStyleResolvable;
  url?: string;
}

export type CustomApplicationCommandOptionData = (
  ApplicationCommandNonOptionsData
  | ApplicationCommandChannelOptionData
  | ApplicationCommandChoicesData
) & { onComplete(interaction: AutocompleteInteraction, value: string | number): ApplicationCommandOptionChoice[] }
type cooldown = {
  type: cooldownType;
  amount: number;
}
export class BaseInteraction {
  private _type: string;
  name: string[];
  id?: string;
  perms?: { bot: PermissionString[], user: PermissionString[] };
  onInteraction(interaction: CommandInteraction | ContextMenuInteraction, other: IOther): void;
  toJSON(): MessageButton | MessageSelectMenu | undefined;
  onLoad?(client: Client): void;
  coolDowns: Map<string, number>;
  description!: string;
  disabled?: boolean;
  developerOnly?: boolean;
  other?: { [key: string | number]: any };
  coolDown?: cooldown[] | cooldown | number;
  guildOnly?: boolean;
  options?: CustomApplicationCommandOptionData[];
  defaultPermission?: boolean;
  actionType?: ApplicationCommandType | "SELECT_MENU" | "BUTTON";
  isSelectMenu(): this is import("./SelectMenu");
  isButton(): this is import("./Button");
  isChatActionCommand(): this is import("./SlashCommand");
  isUserActionCommand(): this is import("./UserAction");
  isMessageActionCommand(): this is import("./MessageAction");
  constructor(arg: TInteractionConstructor);
}

export type TOmittedInteraction = Omit<BaseInteraction, "_type" | "coolDowns" | "name" | "onInteraction" | "actionType" | "options" | "toJSON">;
export type TInteractionConstructor = TOmittedInteraction & ((ActionChatCommand | ActionRightClickCommand | SelectMenu | Button));
type cooldownType = "user" | "member" | "channel" | "guild" | "message" | "any";
export interface IOther {
  setCoolDown(durations: number, type: cooldownType): void,
  [key: string | number]: any
}

export interface ActionChatCommand {
  name: string[];
  actionType: "CHAT_INPUT";
  onInteraction(interaction: CommandInteraction, other: IOther): void;
  options: CustomApplicationCommandOptionData[];
  toJSON(): undefined;
}

export interface ActionRightClickCommand {
  name: string;
  actionType: "MESSAGE" | "USER";
  onInteraction(interaction: ContextMenuInteraction, other: IOther): void;
  options: undefined;
  toJSON(): undefined;
}

export interface SelectMenu {
  name: string;
  actionType: "SELECT_MENU";
  onInteraction(interaction: SelectMenuInteraction, other: IOther): void;
  options?: CustomSelectMenuOptions;
  toJSON(): MessageSelectMenu;
}

export interface Button {
  name: string;
  actionType: "BUTTON";
  onInteraction(interaction: ButtonInteraction, other: IOther): void;
  options?: CustomButtonOptions;
  toJSON(): MessageButton;
}

export = BaseInteraction;