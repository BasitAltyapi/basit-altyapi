import {
  ApplicationCommandChannelOptionData,
  ApplicationCommandChoicesData,
  ApplicationCommandNonOptionsData,
  ApplicationCommandOptionChoice,
  ApplicationCommandType,
  AutocompleteInteraction,
  ButtonInteraction,
  Client,
  CommandInteraction,
  ContextMenuInteraction,
  EmojiResolvable,
  MessageButton,
  MessageButtonStyleResolvable,
  MessageSelectMenu,
  MessageSelectOptionData,
  PermissionString,
  SelectMenuInteraction
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

type UserPermString = (PermissionString | "DEVELOPER" | "GUILD_OWNER");

export class BaseInteraction {
    name: string[];
    id?: string;
    perms?: { bot: PermissionString[], user: UserPermString[] };
    coolDowns: Map<string, number>;
    description!: string;
    disabled?: boolean;
    other?: { [key: string | number]: any };
    coolDown?: cooldown[] | cooldown | number;
    guildOnly?: boolean;
    options?: CustomApplicationCommandOptionData[];
    defaultPermission?: boolean;
    actionType?: ApplicationCommandType | "SELECT_MENU" | "BUTTON";
    private _type: string;

    constructor(arg: TInteractionConstructor);

    onInteraction(interaction: CommandInteraction | ContextMenuInteraction, other: IOther): void;

    toJSON(): MessageButton | MessageSelectMenu | undefined;

    onLoad?(client: Client): void;

    isSelectMenu(): this is import("./SelectMenu");

    isButton(): this is import("./Button");

    isChatActionCommand(): this is import("./SlashCommand");

    isUserActionCommand(): this is import("./UserAction");

    isMessageActionCommand(): this is import("./MessageAction");
}

export type TOmittedInteraction = Omit<BaseInteraction, "_type" | "coolDowns" | "name" | "onInteraction" | "actionType" | "options" | "toJSON">;
export type TInteractionConstructor =
    TOmittedInteraction
    & ((ActionChatCommand | ActionRightClickCommand | SelectMenu | Button));
type cooldownType = "user" | "member" | "channel" | "guild" | "message" | "any";

export interface IOther {
    setCoolDown(durations: number, type: cooldownType): void,

    [key: string | number]: any
}

export interface ActionChatCommand {
    name: string[];
    actionType: "CHAT_INPUT";
    options: CustomApplicationCommandOptionData[];

    onInteraction(interaction: CommandInteraction, other: IOther): void;

    toJSON(): undefined;
}

export interface ActionRightClickCommand {
    name: string;
    actionType: "MESSAGE" | "USER";
    options: undefined;

    onInteraction(interaction: ContextMenuInteraction, other: IOther): void;

    toJSON(): undefined;
}

export interface SelectMenu {
    name: string;
    actionType: "SELECT_MENU";
    options?: CustomSelectMenuOptions;

    onInteraction(interaction: SelectMenuInteraction, other: IOther): void;

    toJSON(): MessageSelectMenu;
}

export interface Button {
    name: string;
    actionType: "BUTTON";
    options?: CustomButtonOptions;

    onInteraction(interaction: ButtonInteraction, other: IOther): void;

    toJSON(): MessageButton;
}

export = BaseInteraction;
