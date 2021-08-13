import { ApplicationCommandOption, ApplicationCommandType, Client, CommandInteraction, ContextMenuInteraction, PermissionString } from "discord.js";

class BaseCommand {
  private _type: string;
  name: string;
  id?: string;
  type: "COMMAND" | "SUB_COMMAND";
  subName?: string;
  perms?: { bot: PermissionString[], user: PermissionString[] };
  onCommand: (interaction: CommandInteraction | ContextMenuInteraction, other: IOther ) => void;
  onLoad?: (client: Client) => void;
  coolDowns: Map<string, number>;
  description!: string;
  disabled?: boolean;
  developerOnly?: boolean;
  other?: { [key: string | number]: any };
  coolDown?: number;
  guildOnly?: boolean;
  options?: ApplicationCommandOption[];
  defaultPermission?: boolean;
  actionType?: ApplicationCommandType;
  constructor(arg: Omit<BaseCommand, "_type" | "coolDowns" | "name" | "subName" | "type" | "onCommand"> & ((EasyNormalCommand | EasySubCommand) & (ActionChatCommand | ActionRightClickCommand)))
}

interface IOther {
  setCoolDown(durations: number): void,
  [key: string | number]: any
}

interface ActionChatCommand {
  actionType: "CHAT_INPUT";
  onCommand: (interaction: CommandInteraction, other: IOther) => void;
}

interface ActionRightClickCommand {
  actionType: "MESSAGE" | "USER";
  onCommand: (interaction: ContextMenuInteraction, other: IOther) => void;
}

interface EasyNormalCommand {
  type: "COMMAND";
  name: string;
}

interface EasySubCommand {
  type: "SUB_COMMAND";
  name: string;
  subName: string;
}

export = BaseCommand;