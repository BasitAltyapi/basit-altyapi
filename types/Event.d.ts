import {
  ApplicationInteraction,
  Client,
  Collection,
  DMChannel,
  Guild,
  GuildBan,
  GuildChannel,
  GuildEmoji,
  GuildMember,
  Interaction,
  InvalidRequestWarningData,
  Invite,
  Message,
  MessageReaction,
  NewsChannel,
  PartialDMChannel,
  PartialGuildMember,
  PartialMessage,
  PartialMessageReaction,
  PartialUser,
  Presence,
  RateLimitData,
  Role,
  Snowflake,
  StageInstance,
  Sticker,
  TextChannel,
  ThreadChannel,
  ThreadMember,
  Typing,
  VoiceState,
} from "discord.js";
import { PluginAPI } from "./Plugin";

export interface IOther {
  pluginApi?: PluginAPI;
  [key: string | number]: any
}

export class BaseEvent {
  private _type: string;

  id?: string;

  eventName!: string;
  pluginApi?: PluginAPI;

  onLoad?: (client: Client) => void;

  onEvent!: (...args: any[]) => {};

  disabled?: boolean;

  constructor(arg: Omit<BaseEvent, "onEvent" | "eventName" | "_type"> & TEvents)
}

export = BaseEvent;

export type TEvents = ApplicationInteractionCreateEvent | ApplicationInteractionDeleteEvent | ApplicationInteractionUpdateEvent | ChannelCreateEvent | ChannelDeleteEvent | ChannelPinsUpdateEvent | ChannelUpdateEvent | DebugEvent | WarnEvent | EmojiCreateEvent | EmojiDeleteEvent | EmojiUpdateEvent | ErrorEvent | GuildBanAddEvent | GuildBanRemoveEvent | GuildCreateEvent | GuildDeleteEvent | GuildUnavailableEvent | GuildIntegrationsUpdateEvent | GuildMemberAddEvent | GuildMemberAvailableEvent | GuildMemberRemoveEvent | GuildMembersChunkEvent | GuildMemberUpdateEvent | GuildUpdateEvent | InviteCreateEvent | InviteDeleteEvent | MessageEvent | MessageCreateEvent | MessageDeleteEvent | MessageReactionRemoveAllEvent | MessageReactionRemoveEmojiEvent | MessageDeleteBulkEvent | MessageReactionAddEvent | MessageReactionRemoveEvent | MessageUpdateEvent | PresenceUpdateEvent | RateLimitEvent | InvalidRequestWarningEvent | ReadyEvent | RoleCreateEvent | RoleDeleteEvent | RoleUpdateEvent | ThreadCreateEvent | ThreadDeleteEvent | ThreadListSyncEvent | ThreadMemberUpdateEvent | ThreadMembersUpdateEvent | ThreadUpdateEvent | TypingStartEvent | UserUpdateEvent | VoiceStateUpdateEvent | WebhookUpdateEvent | InteractionEvent | InteractionCreateEvent | ShardDisconnectEvent | ShardErrorEvent | ShardReadyEvent | ShardReconnectingEvent | ShardResumeEvent | StageInstanceCreateEvent | StageInstanceUpdateEvent | StageInstanceDeleteEvent | StickerCreateEvent | StickerDeleteEvent | StickerUpdateEvent | ScheduledEventCreateEvent | ScheduledEventDeleteEvent | ScheduledEventUpdateEvent | ScheduledEventUserAddEvent | import("../generated/pluginTypes").TEvents;

export type TEventNames = "applicationCommandCreate" | "applicationCommandDelete" | "applicationCommandUpdate" | "channelCreate" | "channelDelete" | "channelPinsUpdate" | "channelUpdate" | "debug" | "emojiCreate" | "emojiDelete" | "emojiUpdate" | "error" | "guildBanAdd" | "guildBanRemove" | "guildCreate" | "guildDelete" | "guildIntegrationsUpdate" | "guildMemberAdd" | "guildMemberAvailable" | "guildMemberRemove" | "guildMembersChunk" | "guildMemberUpdate" | "guildUnavailable" | "guildUpdate" | "interaction" | "interactionCreate" | "invalidated" | "invalidRequestWarning" | "inviteCreate" | "inviteDelete" | "message" | "messageCreate" | "messageDelete" | "messageDeleteBulk" | "messageReactionAdd" | "messageReactionRemove" | "messageReactionRemoveAll" | "messageReactionRemoveEmoji" | "messageUpdate" | "presenceUpdate" | "rateLimit" | "ready" | "roleCreate" | "roleDelete" | "roleUpdate" | "shardDisconnect" | "shardError" | "shardReady" | "shardReconnecting" | "shardResume" | "stageInstanceCreate" | "stageInstanceDelete" | "stageInstanceUpdate" | "stickerCreate" | "stickerDelete" | "stickerUpdate" | "threadCreate" | "threadDelete" | "threadListSync" | "threadMembersUpdate" | "threadMemberUpdate" | "threadUpdate" | "typingStart" | "userUpdate" | "voiceStateUpdate" | "warn" | "webhookUpdate" | "guildScheduledEventCreate" | "guildScheduledEventDelete" | "guildScheduledEventUpdate" | "guildScheduledEventUserAdd" | import("../generated/pluginTypes").TEventNames;

export interface ApplicationInteractionCreateEvent { eventName: "applicationInteractionCreate"; onEvent: (command: ApplicationInteraction, other: IOther) => any };
export interface ApplicationInteractionDeleteEvent { eventName: "applicationInteractionDelete"; onEvent: (command: ApplicationInteraction, other: IOther) => any };
export interface ApplicationInteractionUpdateEvent { eventName: "applicationInteractionUpdate"; onEvent: (oldCommand: ApplicationInteraction | null, newCommand: ApplicationInteraction, other: IOther) => any };
export interface ChannelCreateEvent { eventName: "channelCreate"; onEvent: (channel: GuildChannel, other: IOther) => any };
export interface ChannelDeleteEvent { eventName: "channelDelete"; onEvent: (channel: DMChannel | GuildChannel, other: IOther) => any };
export interface ChannelPinsUpdateEvent { eventName: "channelPinsUpdate"; onEvent: (channel: TextChannel | NewsChannel | DMChannel | PartialDMChannel, date: Date, other: IOther) => any };
export interface ChannelUpdateEvent { eventName: "channelUpdate"; onEvent: (oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel, other: IOther) => any };
export interface DebugEvent { eventName: "debug"; onEvent: (message: string, other: IOther) => any };
export interface WarnEvent { eventName: "warn"; onEvent: (message: string, other: IOther) => any };
export interface EmojiCreateEvent { eventName: "emojiCreate"; onEvent: (emoji: GuildEmoji, other: IOther) => any };
export interface EmojiDeleteEvent { eventName: "emojiDelete"; onEvent: (emoji: GuildEmoji, other: IOther) => any };
export interface EmojiUpdateEvent { eventName: "emojiUpdate"; onEvent: (oldEmoji: GuildEmoji, newEmoji: GuildEmoji, other: IOther) => any };
export interface ErrorEvent { eventName: "error"; onEvent: (error: Error, other: IOther) => any };
export interface GuildBanAddEvent { eventName: "guildBanAdd"; onEvent: (ban: GuildBan, other: IOther) => any };
export interface GuildBanRemoveEvent { eventName: "guildBanRemove"; onEvent: (ban: GuildBan, other: IOther) => any };
export interface GuildCreateEvent { eventName: "guildCreate"; onEvent: (guild: Guild, other: IOther) => any };
export interface GuildDeleteEvent { eventName: "guildDelete"; onEvent: (guild: Guild, other: IOther) => any };
export interface GuildUnavailableEvent { eventName: "guildUnavailable"; onEvent: (guild: Guild, other: IOther) => any };
export interface GuildIntegrationsUpdateEvent { eventName: "guildIntegrationsUpdate"; onEvent: (guild: Guild, other: IOther) => any };
export interface GuildMemberAddEvent { eventName: "guildMemberAdd"; onEvent: (member: GuildMember, other: IOther) => any };
export interface GuildMemberAvailableEvent { eventName: "guildMemberAvailable"; onEvent: (member: GuildMember | PartialGuildMember, other: IOther) => any };
export interface GuildMemberRemoveEvent { eventName: "guildMemberRemove"; onEvent: (member: GuildMember | PartialGuildMember, other: IOther) => any };
export interface GuildMembersChunkEvent { eventName: "guildMembersChunk"; onEvent: (members: Collection<Snowflake, GuildMember>, guild: Guild, data: { count: number; index: number; nonce: string | undefined }, other: IOther) => any };
export interface GuildMemberUpdateEvent { eventName: "guildMemberUpdate"; onEvent: (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember, other: IOther) => any };
export interface GuildUpdateEvent { eventName: "guildUpdate"; onEvent: (oldGuild: Guild, newGuild: Guild, other: IOther) => any };
export interface InviteCreateEvent { eventName: "inviteCreate"; onEvent: (invite: Invite, other: IOther) => any };
export interface InviteDeleteEvent { eventName: "inviteDelete"; onEvent: (invite: Invite, other: IOther) => any };
export interface MessageEvent { eventName: "message"; onEvent: (message: Message, other: IOther) => any };
export interface MessageCreateEvent { eventName: "messageCreate"; onEvent: (message: Message, other: IOther) => any };
export interface MessageDeleteEvent { eventName: "messageDelete"; onEvent: (message: Message | PartialMessage, other: IOther) => any };
export interface MessageReactionRemoveAllEvent { eventName: "messageReactionRemoveAll"; onEvent: (message: Message | PartialMessage, other: IOther) => any };
export interface MessageReactionRemoveEmojiEvent { eventName: "messageReactionRemoveEmoji"; onEvent: (reaction: MessageReaction | PartialMessageReaction, other: IOther) => any };
export interface MessageDeleteBulkEvent { eventName: "messageDeleteBulk"; onEvent: (messages: Collection<Snowflake, Message | PartialMessage>, other: IOther) => any };
export interface MessageReactionAddEvent { eventName: "messageReactionAdd"; onEvent: (message: MessageReaction | PartialMessageReaction, user: User | PartialUser, other: IOther) => any };
export interface MessageReactionRemoveEvent { eventName: "messageReactionRemove"; onEvent: (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, other: IOther) => any };
export interface MessageUpdateEvent { eventName: "messageUpdate"; onEvent: (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage, other: IOther) => any };
export interface PresenceUpdateEvent { eventName: "presenceUpdate"; onEvent: (oldPresence: Presence | null, newPresence: Presence, other: IOther) => any };
export interface RateLimitEvent { eventName: "rateLimit"; onEvent: (rateLimitData: RateLimitData, other: IOther) => any };
export interface InvalidRequestWarningEvent { eventName: "invalidRequestWarning"; onEvent: (invalidRequestWarningData: InvalidRequestWarningData, other: IOther) => any };
export interface ReadyEvent { eventName: "ready"; onEvent: (client: Client<true>, other: IOther) => any };
export interface RoleCreateEvent { eventName: "roleCreate"; onEvent: (role: Role, other: IOther) => any };
export interface RoleDeleteEvent { eventName: "roleDelete"; onEvent: (role: Role, other: IOther) => any };
export interface RoleUpdateEvent { eventName: "roleUpdate"; onEvent: (oldRole: Role, newRole: Role, other: IOther) => any };
export interface ThreadCreateEvent { eventName: "threadCreate"; onEvent: (thread: ThreadChannel, other: IOther) => any };
export interface ThreadDeleteEvent { eventName: "threadDelete"; onEvent: (thread: ThreadChannel, other: IOther) => any };
export interface ThreadListSyncEvent { eventName: "threadListSync"; onEvent: (threads: Collection<Snowflake, ThreadChannel>, other: IOther) => any };
export interface ThreadMemberUpdateEvent { eventName: "threadMemberUpdate"; onEvent: (oldMember: ThreadMember, newMember: ThreadMember, other: IOther) => any };
export interface ThreadMembersUpdateEvent { eventName: "threadMembersUpdate"; onEvent: (oldMembers: Collection<Snowflake, ThreadMember>, newMembers: Collection<Snowflake, ThreadMember>, other: IOther) => any };
export interface ThreadUpdateEvent { eventName: "threadUpdate"; onEvent: (oldThread: ThreadChannel, newThread: ThreadChannel, other: IOther) => any };
export interface TypingStartEvent { eventName: "typingStart"; onEvent: (typing: Typing, other: IOther) => any };
export interface UserUpdateEvent { eventName: "userUpdate"; onEvent: (oldUser: User | PartialUser, newUser: User, other: IOther) => any };
export interface VoiceStateUpdateEvent { eventName: "voiceStateUpdate"; onEvent: (oldState: VoiceState, newState: VoiceState, other: IOther) => any };
export interface WebhookUpdateEvent { eventName: "webhookUpdate"; onEvent: (channel: TextChannel, other: IOther) => any };
export interface InteractionEvent { eventName: "interaction"; onEvent: (interaction: Interaction, other: IOther) => any };
export interface InteractionCreateEvent { eventName: "interactionCreate"; onEvent: (interaction: Interaction, other: IOther) => any };
export interface ShardDisconnectEvent { eventName: "shardDisconnect"; onEvent: (closeEvent: CloseEvent, shardId: number, other: IOther) => any };
export interface ShardErrorEvent { eventName: "shardError"; onEvent: (error: Error, shardId: number, other: IOther) => any };
export interface ShardReadyEvent { eventName: "shardReady"; onEvent: (shardId: number, unavailableGuilds: Set<Snowflake> | undefined, other: IOther) => any };
export interface ShardReconnectingEvent { eventName: "shardReconnecting"; onEvent: (shardId: number, other: IOther) => any };
export interface ShardResumeEvent { eventName: "shardResume"; onEvent: (shardId: number, replayedEvents: number, other: IOther) => any };
export interface StageInstanceCreateEvent { eventName: "stageInstanceCreate"; onEvent: (stageInstance: StageInstance, other: IOther) => any };
export interface StageInstanceUpdateEvent { eventName: "stageInstanceUpdate"; onEvent: (oldStageInstance: StageInstance | null, newStageInstance: StageInstance, other: IOther) => any };
export interface StageInstanceDeleteEvent { eventName: "stageInstanceDelete"; onEvent: (stageInstance: StageInstance, other: IOther) => any };
export interface StickerCreateEvent { eventName: "stickerCreate"; onEvent: (sticker: Sticker, other: IOther) => any };
export interface StickerDeleteEvent { eventName: "stickerDelete"; onEvent: (sticker: Sticker, other: IOther) => any };
export interface StickerUpdateEvent { eventName: "stickerUpdate"; onEvent: (oldSticker: Sticker, newSticker: Sticker, other: IOther) => any };
export interface ScheduledEventCreateEvent { eventName: "guildScheduledEventCreate"; onEvent: (event: GuildScheduledEvent<"Scheduled" | "Active" | "Completed" | "Canceled">, other: IOther) => any };
export interface ScheduledEventDeleteEvent { eventName: "guildScheduledEventDelete"; onEvent: (event: GuildScheduledEvent<"Scheduled" | "Active" | "Completed" | "Canceled">, other: IOther) => any };
export interface ScheduledEventUpdateEvent { eventName: "guildScheduledEventUpdate"; onEvent: (oldEvent: GuildScheduledEvent<"Scheduled" | "Active" | "Completed" | "Canceled">, newEvent: GuildScheduledEvent<"Scheduled" | "Active" | "Completed" | "Canceled">, other: IOther) => any };
export interface ScheduledEventUserAddEvent { eventName: "guildScheduledEventUserAdd"; onEvent: (event: GuildScheduledEvent<"Scheduled" | "Active" | "Completed" | "Canceled">, user: User, other: IOther) => any };