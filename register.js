const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder } = require("@discordjs/builders");
const commands = [
    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows the list of commands or help on specified command."),
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Checks connectivity with discord's servers."),
    new SlashCommandBuilder().setName("add-coins").setDescription("Add coins to a user."),
].map((command) => command.toJSON());

const commandsBody = JSON.stringify(commands);

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();
