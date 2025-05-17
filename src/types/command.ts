import { Message, CommandInteraction, Client, ChannelType } from "discord.js";

export enum CommandCategory {
    UTILITY = "utility",
    SOCIAL = "social",
    MODERATION = "moderation",
    MUSIC = "music",
    FUN = "fun",
    PROPOSALS = "proposals"
}

export interface BaseCommand {
    name: string;
    description: string;
    category: CommandCategory;
}

export interface PrefixCommand extends BaseCommand {
    alias?: string[];
    execute: (message: Message, args: string[]) => Promise<void>;
}

export interface SlashCommand extends BaseCommand {
    data: any;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

export interface CommandHandler {
    prefixCommands: Map<string, PrefixCommand>;
    initialize: (client: Client) => Promise<void>;
}

// Tipos específicos para comandos de moderación
export interface ModerationCommand extends PrefixCommand {
    category: CommandCategory.MODERATION;
    permissions?: string[];
}

// Tipos específicos para comandos de música
export interface MusicCommand extends PrefixCommand {
    category: CommandCategory.MUSIC;
    requiresVoiceChannel?: boolean;
}

// Tipos específicos para comandos sociales
export interface SocialCommand extends PrefixCommand {
    category: CommandCategory.SOCIAL;
    requiresMention?: boolean;
}
