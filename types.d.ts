import { Caching } from "./Caching";
import { DB } from "./territorial-db.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Client } from "discord.js";

export type Theme = {
    mainColor: string;
};

export type UserData = {
    coins: number;
};

export type UserCache = {
    userId: string;
    data: UserData | null;
    lastCommandCall: number;
};

export type CommandHandlerOptions = {
    cache?: Caching;
    client?: Client;
    db?: DB;
};

export type CommandHandler = {
    slashCMDBuilder: SlashCommandBuilder;
    execute: (interaction: CommandInteraction, options: CommandHandlerOptions) => Promise<void>;
    permissionLevel: number;
};

export type GuildConfig = {
    name: string;
    id: string;
    permissionLevels: [key: string, { roleName: string; roleId: string }];
};
