const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandMentionableOption,
} = require("@discordjs/builders");
const commands = [
    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows the list of commands or help on specified command."),
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Checks connectivity with discord's servers.")
        .setDefaultPermission(false),
    new SlashCommandBuilder()
        .setName("logs")
        .setDescription("Display user logs.")
        .setDefaultPermission(false)
        .addMentionableOption((opt) =>
            opt.setName("user").setDescription("User to get logs for.").setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows leaderboard.")
        .addBooleanOption((opt) =>
            opt
                .setName("chat")
                .setDescription("Display in chat for everyone to see (default false)")
        )
        .addIntegerOption((opt) =>
            opt
                .setName("limit")
                .setDescription("The number of users to show (defaiult 10)")
                .setMinValue(10)
                .setMaxValue(100)
        ),
    new SlashCommandBuilder().setName("profile").setDescription("Check your profile."),
    new SlashCommandBuilder()
        .setName("coins")
        .setDescription("add/remove/show coins for a user")
        .setDefaultPermission(false)
        .addSubcommand((sub) =>
            sub
                .setName("add")
                .setDescription("add coins to a user")
                .addMentionableOption((opt) =>
                    opt
                        .setName("user")
                        .setDescription("The user to add coins to.")
                        .setRequired(true)
                )
                .addIntegerOption((opt) =>
                    opt
                        .setName("amount")
                        .setDescription("The amount of coins to add.")
                        .setRequired(true)
                        .setMinValue(10)
                        .setMaxValue(1000)
                )
                .addStringOption((opt) =>
                    opt
                        .setName("reason")
                        .setDescription("Describe the reason for adding coins.")
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName("remove")
                .setDescription("remove coins from a user")
                .addMentionableOption((opt) =>
                    opt
                        .setName("user")
                        .setDescription("The user to remove coins from.")
                        .setRequired(true)
                )
                .addIntegerOption((opt) =>
                    opt
                        .setName("amount")
                        .setDescription("The amount of coins to remove.")
                        .setRequired(true)
                        .setMinValue(10)
                        .setMaxValue(1000)
                )
                .addStringOption((opt) =>
                    opt
                        .setName("reason")
                        .setDescription("Describe the reason for removing coins.")
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName("show")
                .setDescription("show amount of coins for a user")
                .addMentionableOption((opt) =>
                    opt.setName("user").setDescription("The target user.").setRequired(true)
                )
        ),
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
