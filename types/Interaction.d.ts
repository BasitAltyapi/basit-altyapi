import {
  // ApplicationCommandChannelOptionData,
  // ApplicationCommandChoicesData,
  // ApplicationCommandNonOptionsData,
  ChannelTypeEnumResolvable,
  ChannelType,
  CommandOptionNonChoiceResolvableType,
  CommandOptionChannelResolvableType,
  CommandOptionDataTypeResolvable,
  CommandOptionChoiceResolvableType,
  CommandInteractionOption,
  ApplicationCommandOptionChoice,
  ApplicationCommandOptionData,
  ApplicationCommandType,
  AutocompleteInteraction,
  CacheType,
  Client,
  CommandInteraction,
  ContextMenuInteraction,
  PermissionResolvable,
  SelectMenuInteraction,
  SelectMenuComponentOptionData,
  ButtonInteraction,
  SelectMenuBuilder,
  ButtonBuilder,
  ButtonStyleEnumResolvable,
  EmojiResolvable,
  ModalSubmitInteraction,
  ModalBuilder,
  TextInputComponentData,
  ApplicationCommandOptionType,
  PermissionResolvable,
} from "discord.js";
import { PluginAPI } from "./Plugin";

interface CustomSelectMenuOptions {
  min?: number;
  max?: number;
  choices: SelectMenuComponentOptionData[];
  placeholder?: string;
}

interface CustomModalOptions {
  title?: string;
  rows: { type: "TextInput", data: TextInputComponentData }[][]
}

interface CustomButtonOptions {
  emoji?: EmojiResolvable;
  label?: string;
  style: ButtonStyleEnumResolvable;
  url?: string;
}

export type CustomApplicationCommandOptionData = {
  name: string,
  description: string,
  choices: { name: string, value: string }[],
  type: "Number" | "String" | "User" | "Integer" | "Channel" | "Role" | "Boolean" | "Mentionable",
  autocomplete: boolean,
  required: boolean,
  channelTypes: ("GuildText" | "Dm" | "GuildVoice" | "GroupDm" | "GuildCategory" | "GuildNews" | "GuildNewsThread" | "GuildPublicThread" | "GuildPrivateThread" | "GuildStageVoice")[],
  onComplete(
    interaction: AutocompleteInteraction,
    value: string | number,
    other: IOther
  ): { name: string, value: string }[];
};

type Cooldown = {
  type: CooldownType;
  amount: number;
};

type UserPermString = PermissionResolvable | "Developer" | "GuildOwner";

export class BaseInteraction {
  private _type: string;
  name: string[];
  id?: string;
  pluginApi?: PluginAPI;
  perms?: { bot: PermissionResolvable[]; user: UserPermString[] };
  onInteraction(
    interaction: CommandInteraction | ContextMenuInteraction,
    other: IOther
  ): void;
  toJSON(
    data: Array<string | number>
  ): ButtonBuilder | SelectMenuBuilder | ModalBuilder | undefined;
  publishType?: "globalOnly" | "guildOnly" | "all" | string;
  onLoad?(client: Client): void;
  coolDowns: Map<string, number>;
  description!: string;
  disabled?: boolean;
  other?: { [key: string | number]: any };
  coolDown?: Cooldown[] | Cooldown | number;
  guildOnly?: boolean;
  options?: CustomApplicationCommandOptionData[];
  defaultPermission?: boolean;
  actionType?: ApplicationCommandType | "SelectMenu" | "Button" | "Modal";
  autoDefer?: "off" | "on" | "ephemeral";
  nullError?: boolean;
  calculated?: { [key: string | number]: any };
  isSelectMenu(): this is import("./SelectMenu");
  isButton(): this is import("./Button");
  isChatActionCommand(): this is import("./ChatInput");
  isUserActionCommand(): this is import("./UserAction");
  isMessageActionCommand(): this is import("./MessageAction");
  constructor(arg: TInteractionConstructor);
}

export type TOmittedInteraction = Omit<
  BaseInteraction,
  | "_type"
  | "coolDowns"
  | "name"
  | "onInteraction"
  | "actionType"
  | "options"
  | "toJSON"
  | "calculated"
>;
export type TInteractionConstructor = TOmittedInteraction &
  (ActionChatCommand | ActionRightClickCommand | SelectMenu | Button);
type CooldownType = "user" | "member" | "channel" | "guild" | "message" | "any";
export interface IOther {
  setCoolDown(durations: number, type: CooldownType): void;
  locale: import("./Locale").Data;
  pluginApi?: PluginAPI;
  data: (string | number | { [string | number]: any; $unRef(): boolean })[];
  [key: string | number]: any;
}

export interface ActionChatCommand {
  name: string[];
  actionType: "ChatInput";
  onInteraction(interaction: CommandInteraction, other: IOther): void;
  options: CustomApplicationCommandOptionData[];
  toJSON(): undefined;
}

export interface ActionRightClickCommand {
  name: string;
  actionType: "Message" | "User";
  onInteraction(interaction: ContextMenuInteraction, other: IOther): void;
  options: undefined;
  toJSON(): undefined;
}

export interface SelectMenu {
  name: string;
  actionType: "SelectMenu";
  onInteraction(interaction: SelectMenuInteraction, other: IOther): void;
  options?: CustomSelectMenuOptions;
  toJSON(data: Array<any>): SelectMenuBuilder;
  nullError?: Boolean;
}

export interface Button {
  name: string;
  actionType: "Button";
  onInteraction(interaction: ButtonInteraction, other: IOther): void;
  options?: {
    emoji?: EmojiResolvable;
    label?: string;
    style: "Primary" | "Secondary" | "Success" | "Danger" | "Link";
    url?: string;
  };
  toJSON(data: Array<any>): ButtonBuilder;
  nullError?: Boolean;
}

export interface Modal {
  name: string;
  actionType: "Modal";
  onInteraction(interaction: ModalSubmitInteraction, other: IOther): void;
  options?: CustomModalOptions;
  toJSON(data: Array<any>): ModalBuilder;
  nullError?: Boolean;
}

export = BaseInteraction;
