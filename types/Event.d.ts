import {
  Channel,
  Collection,
  Guild,
  GuildEmoji,
  GuildMember,
  Invite,
  Message,
  MessageReaction,
  PartialDMChannel,
  PartialGuildMember,
  PartialMessage,
  PartialUser,
  Presence,
  RateLimitData,
  Role,
  Snowflake,
  TextChannel,
  User,
  VoiceState,
} from "discord.js";

class BaseEvent {
  private _type: string;

  name?: string;

  eventName!: string;

  onLoad?: (client: Client) => void;

  onEvent!: (...args: any[]) => {};

  disabled?: boolean;

  constructor(
    arg: Omit<BaseEvent, "onEvent" | "eventName" | "_type"> & TEvents
  );
}

export = BaseEvent;

type TEvents = ChannelCreateEvent | ChannelDeleteEvent | ChannelPinsUpdateEvent | ChannelUpdateEvent | DebugEvent | WarnEvent | DisconnectEvent | EmojiCreateEvent | EmojiDeleteEvent | EmojiUpdateEvent | ErrorEvent | GuildBanAddEvent | GuildBanRemoveEvent | GuildCreateEvent | GuildDeleteEvent | GuildUnavailableEvent | GuildIntegrationsUpdateEvent | GuildMemberAddEvent | GuildMemberAvailableEvent | GuildMemberRemoveEvent | GuildMembersChunkEvent | GuildMemberSpeakingEvent | GuildMemberUpdateEvent | GuildUpdateEvent | InviteCreateEvent | InviteDeleteEvent | MessageEvent | MessageDeleteEvent | MessageReactionRemoveAllEvent | MessageReactionRemoveEmojiEvent | MessageDeleteBulkEvent | MessageReactionAddEvent | MessageReactionRemoveEvent | MessageUpdateEvent | PresenceUpdateEvent | RateLimitEvent | RoleCreateEvent | RoleDeleteEvent | RoleUpdateEvent | TypingStartEvent | UserUpdateEvent | VoiceStateUpdateEvent | WebhookUpdateEvent | ShardDisconnectEvent | ShardErrorEvent | ShardReadyEvent | ShardReconnectingEvent | ShardResumeEvent;

interface ChannelCreateEvent { eventName: "channelCreate"; onEvent: (...args: [Channel]) => any };
interface ChannelDeleteEvent { eventName: "channelDelete"; onEvent: (...args: [Channel | PartialDMChannel]) => any };
interface ChannelPinsUpdateEvent { eventName: "channelPinsUpdate"; onEvent: (...args: [Channel | PartialDMChannel, Date]) => any };
interface ChannelUpdateEvent { eventName: "channelUpdate"; onEvent: (...args: [Channel, Channel]) => any };
interface DebugEvent { eventName: "debug"; onEvent: (...args: [string]) => any };
interface WarnEvent { eventName: "warn"; onEvent: (...args: [string]) => any };
interface DisconnectEvent { eventName: "disconnect"; onEvent: (...args: [any, number]) => any };
interface EmojiCreateEvent { eventName: "emojiCreate"; onEvent: (...args: [GuildEmoji]) => any };
interface EmojiDeleteEvent { eventName: "emojiDelete"; onEvent: (...args: [GuildEmoji]) => any };
interface EmojiUpdateEvent { eventName: "emojiUpdate"; onEvent: (...args: [GuildEmoji, GuildEmoji]) => any };
interface ErrorEvent { eventName: "error"; onEvent: (...args: [Error]) => any };
interface GuildBanAddEvent { eventName: "guildBanAdd"; onEvent: (...args: [Guild, User]) => any };
interface GuildBanRemoveEvent { eventName: "guildBanRemove"; onEvent: (...args: [Guild, User]) => any };
interface GuildCreateEvent { eventName: "guildCreate"; onEvent: (...args: [Guild]) => any };
interface GuildDeleteEvent { eventName: "guildDelete"; onEvent: (...args: [Guild]) => any };
interface GuildUnavailableEvent { eventName: "guildUnavailable"; onEvent: (...args: [Guild]) => any };
interface GuildIntegrationsUpdateEvent { eventName: "guildIntegrationsUpdate"; onEvent: (...args: [Guild]) => any };
interface GuildMemberAddEvent { eventName: "guildMemberAdd"; onEvent: (...args: [GuildMember]) => any };
interface GuildMemberAvailableEvent { eventName: "guildMemberAvailable"; onEvent: (...args: [GuildMember | PartialGuildMember]) => any };
interface GuildMemberRemoveEvent { eventName: "guildMemberRemove"; onEvent: (...args: [GuildMember | PartialGuildMember]) => any };
interface GuildMembersChunkEvent { eventName: "guildMembersChunk"; onEvent: (...args: [Collection<Snowflake, GuildMember>, Guild, { count: number; index: number; nonce: string | undefined }]) => any };
interface GuildMemberSpeakingEvent { eventName: "guildMemberSpeaking"; onEvent: (...args: [GuildMember | PartialGuildMember, Readonly<Speaking>]) => any };
interface GuildMemberUpdateEvent { eventName: "guildMemberUpdate"; onEvent: (...args: [GuildMember | PartialGuildMember, GuildMember]) => any };
interface GuildUpdateEvent { eventName: "guildUpdate"; onEvent: (...args: [Guild, Guild]) => any };
interface InviteCreateEvent { eventName: "inviteCreate"; onEvent: (...args: [Invite]) => any };
interface InviteDeleteEvent { eventName: "inviteDelete"; onEvent: (...args: [Invite]) => any };
interface MessageEvent { eventName: "message"; onEvent: (...args: [Message]) => any };
interface MessageDeleteEvent { eventName: "messageDelete"; onEvent: (...args: [Message | PartialMessage]) => any };
interface MessageReactionRemoveAllEvent { eventName: "messageReactionRemoveAll"; onEvent: (...args: [Message | PartialMessage]) => any };
interface MessageReactionRemoveEmojiEvent { eventName: "messageReactionRemoveEmoji"; onEvent: (...args: [MessageReaction]) => any };
interface MessageDeleteBulkEvent { eventName: "messageDeleteBulk"; onEvent: (...args: [Collection<Snowflake, Message | PartialMessage>]) => any };
interface MessageReactionAddEvent { eventName: "messageReactionAdd"; onEvent: (...args: [MessageReaction, User | PartialUser]) => any };
interface MessageReactionRemoveEvent { eventName: "messageReactionRemove"; onEvent: (...args: [MessageReaction, User | PartialUser]) => any };
interface MessageUpdateEvent { eventName: "messageUpdate"; onEvent: (...args: [Message | PartialMessage, Message | PartialMessage]) => any };
interface PresenceUpdateEvent { eventName: "presenceUpdate"; onEvent: (...args: [Presence | undefined, Presence]) => any };
interface RateLimitEvent { eventName: "rateLimit"; onEvent: (...args: [RateLimitData]) => any };
interface RoleCreateEvent { eventName: "roleCreate"; onEvent: (...args: [Role]) => any };
interface RoleDeleteEvent { eventName: "roleDelete"; onEvent: (...args: [Role]) => any };
interface RoleUpdateEvent { eventName: "roleUpdate"; onEvent: (...args: [Role, Role]) => any };
interface TypingStartEvent { eventName: "typingStart"; onEvent: (...args: [Channel | PartialDMChannel, User | PartialUser]) => any };
interface UserUpdateEvent { eventName: "userUpdate"; onEvent: (...args: [User | PartialUser, User]) => any };
interface VoiceStateUpdateEvent { eventName: "voiceStateUpdate"; onEvent: (...args: [VoiceState, VoiceState]) => any };
interface WebhookUpdateEvent { eventName: "webhookUpdate"; onEvent: (...args: [TextChannel]) => any };
interface ShardDisconnectEvent { eventName: "shardDisconnect"; onEvent: (...args: [CloseEvent, number]) => any };
interface ShardErrorEvent { eventName: "shardError"; onEvent: (...args: [Error, number]) => any };
interface ShardReadyEvent { eventName: "shardReady"; onEvent: (...args: [number, Set<Snowflake> | undefined]) => any };
interface ShardReconnectingEvent { eventName: "shardReconnecting"; onEvent: (...args: [number]) => any };
interface ShardResumeEvent { eventName: "shardResume"; onEvent: (...args: [number, number]) => any };

