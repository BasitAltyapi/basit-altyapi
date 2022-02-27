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

interface IOther {
  [key: string | number]: any
}

class BaseEvent {
  private _type: string;

  id?: string;

  eventName!: string;

  onLoad?: (client: Client) => void;

  onEvent!: (...args: any[]) => {};

  disabled?: boolean;

  constructor(arg: Omit<BaseEvent, "onEvent" | "eventName" | "_type"> & TEvents)
}

export = BaseEvent;

type TEvents = ApplicationInteractionCreateEvent | ApplicationInteractionDeleteEvent | ApplicationInteractionUpdateEvent | ChannelCreateEvent | ChannelDeleteEvent | ChannelPinsUpdateEvent | ChannelUpdateEvent | DebugEvent | WarnEvent | EmojiCreateEvent | EmojiDeleteEvent | EmojiUpdateEvent | ErrorEvent | GuildBanAddEvent | GuildBanRemoveEvent | GuildCreateEvent | GuildDeleteEvent | GuildUnavailableEvent | GuildIntegrationsUpdateEvent | GuildMemberAddEvent | GuildMemberAvailableEvent | GuildMemberRemoveEvent | GuildMembersChunkEvent | GuildMemberUpdateEvent | GuildUpdateEvent | InviteCreateEvent | InviteDeleteEvent | MessageEvent | MessageCreateEvent | MessageDeleteEvent | MessageReactionRemoveAllEvent | MessageReactionRemoveEmojiEvent | MessageDeleteBulkEvent | MessageReactionAddEvent | MessageReactionRemoveEvent | MessageUpdateEvent | PresenceUpdateEvent | RateLimitEvent | InvalidRequestWarningEvent | ReadyEvent | RoleCreateEvent | RoleDeleteEvent | RoleUpdateEvent | ThreadCreateEvent | ThreadDeleteEvent | ThreadListSyncEvent | ThreadMemberUpdateEvent | ThreadMembersUpdateEvent | ThreadUpdateEvent | TypingStartEvent | UserUpdateEvent | VoiceStateUpdateEvent | WebhookUpdateEvent | InteractionEvent | InteractionCreateEvent | ShardDisconnectEvent | ShardErrorEvent | ShardReadyEvent | ShardReconnectingEvent | ShardResumeEvent | StageInstanceCreateEvent | StageInstanceUpdateEvent | StageInstanceDeleteEvent | StickerCreateEvent | StickerDeleteEvent | StickerUpdateEvent | ScheduledEventCreateEvent | ScheduledEventDeleteEvent | ScheduledEventUpdateEvent | ScheduledEventUserAddEvent;

interface ApplicationInteractionCreateEvent { eventName: "applicationInteractionCreate"; onEvent: (command: ApplicationInteraction, other: IOther) => any };
interface ApplicationInteractionDeleteEvent { eventName: "applicationInteractionDelete"; onEvent: (command: ApplicationInteraction, other: IOther) => any };
interface ApplicationInteractionUpdateEvent { eventName: "applicationInteractionUpdate"; onEvent: (oldCommand: ApplicationInteraction | null, newCommand: ApplicationInteraction, other: IOther) => any };
interface ChannelCreateEvent { eventName: "channelCreate"; onEvent: (channel: GuildChannel, other: IOther) => any };
interface ChannelDeleteEvent { eventName: "channelDelete"; onEvent: (channel: DMChannel | GuildChannel, other: IOther) => any };
interface ChannelPinsUpdateEvent { eventName: "channelPinsUpdate"; onEvent: (channel: TextChannel | NewsChannel | DMChannel | PartialDMChannel, date: Date, other: IOther) => any };
interface ChannelUpdateEvent { eventName: "channelUpdate"; onEvent: (oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel, other: IOther) => any };
interface DebugEvent { eventName: "debug"; onEvent: (message: string, other: IOther) => any };
interface WarnEvent { eventName: "warn"; onEvent: (message: string, other: IOther) => any };
interface EmojiCreateEvent { eventName: "emojiCreate"; onEvent: (emoji: GuildEmoji, other: IOther) => any };
interface EmojiDeleteEvent { eventName: "emojiDelete"; onEvent: (emoji: GuildEmoji, other: IOther) => any };
interface EmojiUpdateEvent { eventName: "emojiUpdate"; onEvent: (oldEmoji: GuildEmoji, newEmoji: GuildEmoji, other: IOther) => any };
interface ErrorEvent { eventName: "error"; onEvent: (error: Error, other: IOther) => any };
interface GuildBanAddEvent { eventName: "guildBanAdd"; onEvent: (ban: GuildBan, other: IOther) => any };
interface GuildBanRemoveEvent { eventName: "guildBanRemove"; onEvent: (ban: GuildBan, other: IOther) => any };
interface GuildCreateEvent { eventName: "guildCreate"; onEvent: (guild: Guild, other: IOther) => any };
interface GuildDeleteEvent { eventName: "guildDelete"; onEvent: (guild: Guild, other: IOther) => any };
interface GuildUnavailableEvent { eventName: "guildUnavailable"; onEvent: (guild: Guild, other: IOther) => any };
interface GuildIntegrationsUpdateEvent { eventName: "guildIntegrationsUpdate"; onEvent: (guild: Guild, other: IOther) => any };
interface GuildMemberAddEvent { eventName: "guildMemberAdd"; onEvent: (member: GuildMember, other: IOther) => any };
interface GuildMemberAvailableEvent { eventName: "guildMemberAvailable"; onEvent: (member: GuildMember | PartialGuildMember, other: IOther) => any };
interface GuildMemberRemoveEvent { eventName: "guildMemberRemove"; onEvent: (member: GuildMember | PartialGuildMember, other: IOther) => any };
interface GuildMembersChunkEvent { eventName: "guildMembersChunk"; onEvent: (members: Collection<Snowflake, GuildMember>, guild: Guild, data: { count: number; index: number; nonce: string | undefined }, other: IOther) => any };
interface GuildMemberUpdateEvent { eventName: "guildMemberUpdate"; onEvent: (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember, other: IOther) => any };
interface GuildUpdateEvent { eventName: "guildUpdate"; onEvent: (oldGuild: Guild, newGuild: Guild, other: IOther) => any };
interface InviteCreateEvent { eventName: "inviteCreate"; onEvent: (invite: Invite, other: IOther) => any };
interface InviteDeleteEvent { eventName: "inviteDelete"; onEvent: (invite: Invite, other: IOther) => any };
interface MessageEvent { eventName: "message"; onEvent: (message: Message, other: IOther) => any };
interface MessageCreateEvent { eventName: "messageCreate"; onEvent: (message: Message, other: IOther) => any };
interface MessageDeleteEvent { eventName: "messageDelete"; onEvent: (message: Message | PartialMessage, other: IOther) => any };
interface MessageReactionRemoveAllEvent { eventName: "messageReactionRemoveAll"; onEvent: (message: Message | PartialMessage, other: IOther) => any };
interface MessageReactionRemoveEmojiEvent { eventName: "messageReactionRemoveEmoji"; onEvent: (reaction: MessageReaction | PartialMessageReaction, other: IOther) => any };
interface MessageDeleteBulkEvent { eventName: "messageDeleteBulk"; onEvent: (messages: Collection<Snowflake, Message | PartialMessage>, other: IOther) => any };
interface MessageReactionAddEvent { eventName: "messageReactionAdd"; onEvent: (message: MessageReaction | PartialMessageReaction, user: User | PartialUser, other: IOther) => any };
interface MessageReactionRemoveEvent { eventName: "messageReactionRemove"; onEvent: (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, other: IOther) => any };
interface MessageUpdateEvent { eventName: "messageUpdate"; onEvent: (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage, other: IOther) => any };
interface PresenceUpdateEvent { eventName: "presenceUpdate"; onEvent: (oldPresence: Presence | null, newPresence: Presence, other: IOther) => any };
interface RateLimitEvent { eventName: "rateLimit"; onEvent: (rateLimitData: RateLimitData, other: IOther) => any };
interface InvalidRequestWarningEvent { eventName: "invalidRequestWarning"; onEvent: (invalidRequestWarningData: InvalidRequestWarningData, other: IOther) => any };
interface ReadyEvent { eventName: "ready"; onEvent: (client: Client<true>, other: IOther) => any };
interface RoleCreateEvent { eventName: "roleCreate"; onEvent: (role: Role, other: IOther) => any };
interface RoleDeleteEvent { eventName: "roleDelete"; onEvent: (role: Role, other: IOther) => any };
interface RoleUpdateEvent { eventName: "roleUpdate"; onEvent: (oldRole: Role, newRole: Role, other: IOther) => any };
interface ThreadCreateEvent { eventName: "threadCreate"; onEvent: (thread: ThreadChannel, other: IOther) => any };
interface ThreadDeleteEvent { eventName: "threadDelete"; onEvent: (thread: ThreadChannel, other: IOther) => any };
interface ThreadListSyncEvent { eventName: "threadListSync"; onEvent: (threads: Collection<Snowflake, ThreadChannel>, other: IOther) => any };
interface ThreadMemberUpdateEvent { eventName: "threadMemberUpdate"; onEvent: (oldMember: ThreadMember, newMember: ThreadMember, other: IOther) => any };
interface ThreadMembersUpdateEvent { eventName: "threadMembersUpdate"; onEvent: (oldMembers: Collection<Snowflake, ThreadMember>, newMembers: Collection<Snowflake, ThreadMember>, other: IOther) => any };
interface ThreadUpdateEvent { eventName: "threadUpdate"; onEvent: (oldThread: ThreadChannel, newThread: ThreadChannel, other: IOther) => any };
interface TypingStartEvent { eventName: "typingStart"; onEvent: (typing: Typing, other: IOther) => any };
interface UserUpdateEvent { eventName: "userUpdate"; onEvent: (oldUser: User | PartialUser, newUser: User, other: IOther) => any };
interface VoiceStateUpdateEvent { eventName: "voiceStateUpdate"; onEvent: (oldState: VoiceState, newState: VoiceState, other: IOther) => any };
interface WebhookUpdateEvent { eventName: "webhookUpdate"; onEvent: (channel: TextChannel, other: IOther) => any };
interface InteractionEvent { eventName: "interaction"; onEvent: (interaction: Interaction, other: IOther) => any };
interface InteractionCreateEvent { eventName: "interactionCreate"; onEvent: (interaction: Interaction, other: IOther) => any };
interface ShardDisconnectEvent { eventName: "shardDisconnect"; onEvent: (closeEvent: CloseEvent, shardId: number, other: IOther) => any };
interface ShardErrorEvent { eventName: "shardError"; onEvent: (error: Error, shardId: number, other: IOther) => any };
interface ShardReadyEvent { eventName: "shardReady"; onEvent: (shardId: number, unavailableGuilds: Set<Snowflake> | undefined, other: IOther) => any };
interface ShardReconnectingEvent { eventName: "shardReconnecting"; onEvent: (shardId: number, other: IOther) => any };
interface ShardResumeEvent { eventName: "shardResume"; onEvent: (shardId: number, replayedEvents: number, other: IOther) => any };
interface StageInstanceCreateEvent { eventName: "stageInstanceCreate"; onEvent: (stageInstance: StageInstance, other: IOther) => any };
interface StageInstanceUpdateEvent { eventName: "stageInstanceUpdate"; onEvent: (oldStageInstance: StageInstance | null, newStageInstance: StageInstance, other: IOther) => any };
interface StageInstanceDeleteEvent { eventName: "stageInstanceDelete"; onEvent: (stageInstance: StageInstance, other: IOther) => any };
interface StickerCreateEvent { eventName: "stickerCreate"; onEvent: (sticker: Sticker, other: IOther) => any };
interface StickerDeleteEvent { eventName: "stickerDelete"; onEvent: (sticker: Sticker, other: IOther) => any };
interface StickerUpdateEvent { eventName: "stickerUpdate"; onEvent: (oldSticker: Sticker, newSticker: Sticker, other: IOther) => any };
interface ScheduledEventCreateEvent { eventName: "guildScheduledEventCreate"; onEvent: (event: GuildScheduledEvent<"SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELED">, other: IOther) => any };
interface ScheduledEventDeleteEvent { eventName: "guildScheduledEventDelete"; onEvent: (event: GuildScheduledEvent<"SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELED">, other: IOther) => any };
interface ScheduledEventUpdateEvent { eventName: "guildScheduledEventUpdate"; onEvent: (oldEvent: GuildScheduledEvent<"SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELED">, newEvent: GuildScheduledEvent<"SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELED">, other: IOther) => any };
interface ScheduledEventUserAddEvent { eventName: "guildScheduledEventUserAdd"; onEvent: (event: GuildScheduledEvent<"SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELED">, user: User, other: IOther) => any };