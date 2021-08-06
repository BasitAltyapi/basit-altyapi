import { ApplicationCommandOption, Client, CommandInteraction, PermissionString } from "discord.js";

class BaseCommand {
  private _type: string;
  name: string;
  id: string;
  type: "COMMAND" | "SUB_COMMAND";
  subName?: string;
  perms?: { bot: PermissionString[], user: PermissionString[] };
  onCommand: (interaction: CommandInteraction, other: { setCoolDown(durations: number): void, [key: string | number]: any }) => void;
  onLoad?: (client: Client) => void;
  coolDowns: Map<string, number>;
  description!: string;
  disabled?: boolean;
  developerOnly?: boolean;
  other?: { [key: string | number]: any };
  coolDown?: number;
  guildOnly?: boolean;
  options: ApplicationCommandOption[];
  defaultPermission?: boolean;
  constructor(arg: Omit<BaseCommand, "_type" | "coolDowns" | "name" | "subName" | "type"> & TCommandTypes)
}

type TCommandTypes = NormalCommand | SubCommand;

interface NormalCommand {
  type: "COMMAND";
  name: string;
}

interface SubCommand {
  type: "SUB_COMMAND";
  name: string;
  subName: string;
}

export = BaseCommand;