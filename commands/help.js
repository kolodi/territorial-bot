const { MessageEmbed, Interaction } = require("discord.js");
const config = require("../config");
const { theme } = require("../theme");
const { CommandHandler, CommandHandlerOptions } = require("../types");
const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 *
 * @param { Interaction } interaction
 */
const execute = async (interaction) => {
    const embed = new MessageEmbed()
        .setColor(theme.mainColor)
        .setTitle("Help")
        /* Old code, but kept it. -Tau
		.setDescription(
            "**Territorial Bot.**\n\n" +
                "**Admin comnands:**\n" +
                "To add coins to a user, use the command `/coins add`\n" +
                "To remove coins from a user, use the command `/coins remove`\n" +
                "To see the coins of a user, use the command `/coins show`\n\n" +
                "**User comnands:**\n" +
                "To see the leaderboard, use the command `/leaderboard` \n" +
                "To see your own profile, use the command `/profile`"
		);*/
        .setDescription("**List of commands that the bot can do:**")
        .setFooter({ text: `v0.2 Alpha. Stage: ${process.env.STAGE}` })
        .addFields([
            {
                name: "Admin Commands",
                value:
                    "To see a users information, use `/whois`\n" +
                    "To add coins to an user, use `/coins add`\n" +
                    "To remove coins from an user, use `/coins remove`\n" +
                    "To see the coins of an user, use `/coins show`",
            },
            {
                name: "User Commands",
                value:
                    "To see the leaderboard, use `/leaderboard`\n" +
                    "To see your profile, use `/profile`\n" +
                    "To see some information about the bot, use `/info`",
            },
        ]);
    await interaction.reply({ embeds: [embed], ephemeral: config.ephemeral });
};

/**
 * @type { CommandHandler }
 */
const handler = {
    execute,
    permissionLevel: 0,
    slashCMDBuilder: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows the list of commands or help on specified command."),
};

module.exports = handler;
