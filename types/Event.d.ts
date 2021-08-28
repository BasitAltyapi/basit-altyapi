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

class BaseEvent {
  private _type: string;

  id?: string;

  eventName!: string;

  onLoad?: (client: Client) => void;

  onEvent!: (...args: any[]) => { };

  disabled?: boolean;

  constructor(arg: Omit<BaseEvent, "onEvent" | "eventName" | "_type"> & TEvents)
}

export = BaseEvent;


type TEvents = ApplicationInteractionCreateEvent | ApplicationInteractionDeleteEvent | ApplicationInteractionUpdateEvent | ChannelCreateEvent | ChannelDeleteEvent | ChannelPinsUpdateEvent | ChannelUpdateEvent | DebugEvent | WarnEvent | EmojiCreateEvent | EmojiDeleteEvent | EmojiUpdateEvent | ErrorEvent | GuildBanAddEvent | GuildBanRemoveEvent | GuildCreateEvent | GuildDeleteEvent | GuildUnavailableEvent | GuildIntegrationsUpdateEvent | GuildMemberAddEvent | GuildMemberAvailableEvent | GuildMemberRemoveEvent | GuildMembersChunkEvent | GuildMemberUpdateEvent | GuildUpdateEvent | InviteCreateEvent | InviteDeleteEvent | MessageEvent | MessageCreateEvent | MessageDeleteEvent | MessageReactionRemoveAllEvent | MessageReactionRemoveEmojiEvent | MessageDeleteBulkEvent | MessageReactionAddEvent | MessageReactionRemoveEvent | MessageUpdateEvent | PresenceUpdateEvent | RateLimitEvent | InvalidRequestWarningEvent | ReadyEvent | RoleCreateEvent | RoleDeleteEvent | RoleUpdateEvent | ThreadCreateEvent | ThreadDeleteEvent | ThreadListSyncEvent | ThreadMemberUpdateEvent | ThreadMembersUpdateEvent | ThreadUpdateEvent | TypingStartEvent | UserUpdateEvent | VoiceStateUpdateEvent | WebhookUpdateEvent | InteractionEvent | InteractionCreateEvent | ShardDisconnectEvent | ShardErrorEvent | ShardReadyEvent | ShardReconnectingEvent | ShardResumeEvent | StageInstanceCreateEvent | StageInstanceUpdateEvent | StageInstanceDeleteEvent | StickerCreateEvent | StickerDeleteEvent | StickerUpdateEvent;

interface ApplicationInteractionCreateEvent { eventName: "applicationInteractionCreate"; onEvent: (command: ApplicationInteraction) => any };
interface ApplicationInteractionDeleteEvent { eventName: "applicationInteractionDelete"; onEvent: (command: ApplicationInteraction) => any };
interface ApplicationInteractionUpdateEvent { eventName: "applicationInteractionUpdate"; onEvent: (oldCommand: ApplicationInteraction | null, newCommand: ApplicationInteraction) => any };
interface ChannelCreateEvent { eventName: "channelCreate"; onEvent: (channel: GuildChannel) => any };
interface ChannelDeleteEvent { eventName: "channelDelete"; onEvent: (channel: DMChannel | GuildChannel) => any };
interface ChannelPinsUpdateEvent { eventName: "channelPinsUpdate"; onEvent: (channel: TextChannel | NewsChannel | DMChannel | PartialDMChannel, date: Date) => any };
interface ChannelUpdateEvent { eventName: "channelUpdate"; onEvent: (oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel) => any };
interface DebugEvent { eventName: "debug"; onEvent: (message: string) => any };
interface WarnEvent { eventName: "warn"; onEvent: (message: string) => any };
interface EmojiCreateEvent { eventName: "emojiCreate"; onEvent: (emoji: GuildEmoji) => any };
interface EmojiDeleteEvent { eventName: "emojiDelete"; onEvent: (emoji: GuildEmoji) => any };
interface EmojiUpdateEvent { eventName: "emojiUpdate"; onEvent: (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => any };
interface ErrorEvent { eventName: "error"; onEvent: (error: Error) => any };
interface GuildBanAddEvent { eventName: "guildBanAdd"; onEvent: (ban: GuildBan) => any };
interface GuildBanRemoveEvent { eventName: "guildBanRemove"; onEvent: (ban: GuildBan) => any };
interface GuildCreateEvent { eventName: "guildCreate"; onEvent: (guild: Guild) => any };
interface GuildDeleteEvent { eventName: "guildDelete"; onEvent: (guild: Guild) => any };
interface GuildUnavailableEvent { eventName: "guildUnavailable"; onEvent: (guild: Guild) => any };
interface GuildIntegrationsUpdateEvent { eventName: "guildIntegrationsUpdate"; onEvent: (guild: Guild) => any };
interface GuildMemberAddEvent { eventName: "guildMemberAdd"; onEvent: (member: GuildMember) => any };
interface GuildMemberAvailableEvent { eventName: "guildMemberAvailable"; onEvent: (member: GuildMember | PartialGuildMember) => any };
interface GuildMemberRemoveEvent { eventName: "guildMemberRemove"; onEvent: (member: GuildMember | PartialGuildMember) => any };
interface GuildMembersChunkEvent { eventName: "guildMembersChunk"; onEvent: (members: Collection<Snowflake, GuildMember>, guild: Guild, data: { count: number; index: number; nonce: string | undefined }) => any };
interface GuildMemberUpdateEvent { eventName: "guildMemberUpdate"; onEvent: (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => any };
interface GuildUpdateEvent { eventName: "guildUpdate"; onEvent: (oldGuild: Guild, newGuild: Guild) => any };
interface InviteCreateEvent { eventName: "inviteCreate"; onEvent: (invite: Invite) => any };
interface InviteDeleteEvent { eventName: "inviteDelete"; onEvent: (invite: Invite) => any };
interface MessageEvent { eventName: "message"; onEvent: (message: Message) => any };
interface MessageCreateEvent { eventName: "messageCreate"; onEvent: (message: Message) => any };
interface MessageDeleteEvent { eventName: "messageDelete"; onEvent: (message: Message | PartialMessage) => any };
interface MessageReactionRemoveAllEvent { eventName: "messageReactionRemoveAll"; onEvent: (message: Message | PartialMessage) => any };
interface MessageReactionRemoveEmojiEvent { eventName: "messageReactionRemoveEmoji"; onEvent: (reaction: MessageReaction | PartialMessageReaction) => any };
interface MessageDeleteBulkEvent { eventName: "messageDeleteBulk"; onEvent: (messages: Collection<Snowflake, Message | PartialMessage>) => any };
interface MessageReactionAddEvent { eventName: "messageReactionAdd"; onEvent: (message: MessageReaction | PartialMessageReaction, user: User | PartialUser) => any };
interface MessageReactionRemoveEvent { eventName: "messageReactionRemove"; onEvent: (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => any };
interface MessageUpdateEvent { eventName: "messageUpdate"; onEvent: (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => any };
interface PresenceUpdateEvent { eventName: "presenceUpdate"; onEvent: (oldPresence: Presence | null, newPresence: Presence) => any };
interface RateLimitEvent { eventName: "rateLimit"; onEvent: (rateLimitData: RateLimitData) => any };
interface InvalidRequestWarningEvent { eventName: "invalidRequestWarning"; onEvent: (invalidRequestWarningData: InvalidRequestWarningData) => any };
interface ReadyEvent { eventName: "ready"; onEvent: (client: Client<true>) => any };
interface RoleCreateEvent { eventName: "roleCreate"; onEvent: (role: Role) => any };
interface RoleDeleteEvent { eventName: "roleDelete"; onEvent: (role: Role) => any };
interface RoleUpdateEvent { eventName: "roleUpdate"; onEvent: (oldRole: Role, newRole: Role) => any };
interface ThreadCreateEvent { eventName: "threadCreate"; onEvent: (thread: ThreadChannel) => any };
interface ThreadDeleteEvent { eventName: "threadDelete"; onEvent: (thread: ThreadChannel) => any };
interface ThreadListSyncEvent { eventName: "threadListSync"; onEvent: (threads: Collection<Snowflake, ThreadChannel>) => any };
interface ThreadMemberUpdateEvent { eventName: "threadMemberUpdate"; onEvent: (oldMember: ThreadMember, newMember: ThreadMember) => any };
interface ThreadMembersUpdateEvent { eventName: "threadMembersUpdate"; onEvent: (oldMembers: Collection<Snowflake, ThreadMember>, newMembers: Collection<Snowflake, ThreadMember>) => any };
interface ThreadUpdateEvent { eventName: "threadUpdate"; onEvent: (oldThread: ThreadChannel, newThread: ThreadChannel) => any };
interface TypingStartEvent { eventName: "typingStart"; onEvent: (typing: Typing) => any };
interface UserUpdateEvent { eventName: "userUpdate"; onEvent: (oldUser: User | PartialUser, newUser: User) => any };
interface VoiceStateUpdateEvent { eventName: "voiceStateUpdate"; onEvent: (oldState: VoiceState, newState: VoiceState) => any };
interface WebhookUpdateEvent { eventName: "webhookUpdate"; onEvent: (channel: TextChannel) => any };
interface InteractionEvent { eventName: "interaction"; onEvent: (interaction: Interaction) => any };
interface InteractionCreateEvent { eventName: "interactionCreate"; onEvent: (interaction: Interaction) => any };
interface ShardDisconnectEvent { eventName: "shardDisconnect"; onEvent: (closeEvent: CloseEvent, shardId: number) => any };
interface ShardErrorEvent { eventName: "shardError"; onEvent: (error: Error, shardId: number) => any };
interface ShardReadyEvent { eventName: "shardReady"; onEvent: (shardId: number, unavailableGuilds: Set<Snowflake> | undefined) => any };
interface ShardReconnectingEvent { eventName: "shardReconnecting"; onEvent: (shardId: number) => any };
interface ShardResumeEvent { eventName: "shardResume"; onEvent: (shardId: number, replayedEvents: number) => any };
interface StageInstanceCreateEvent { eventName: "stageInstanceCreate"; onEvent: (stageInstance: StageInstance) => any };
interface StageInstanceUpdateEvent { eventName: "stageInstanceUpdate"; onEvent: (oldStageInstance: StageInstance | null, newStageInstance: StageInstance) => any };
interface StageInstanceDeleteEvent { eventName: "stageInstanceDelete"; onEvent: (stageInstance: StageInstance) => any };
interface StickerCreateEvent { eventName: "stickerCreate"; onEvent: (sticker: Sticker) => any };
interface StickerDeleteEvent { eventName: "stickerDelete"; onEvent: (sticker: Sticker) => any };
interface StickerUpdateEvent { eventName: "stickerUpdate"; onEvent: (oldSticker: Sticker, newSticker: Sticker) => any };