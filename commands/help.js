const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
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
		.addFields([{
			name: "Admin Commands",
			value:	"To add coins to an user, use `/coins add`\n" +
					"To remove coins from an user, use `/coins remove`\n" +
					"To see the coins of an user, use `/coins show`"
		},{
			name: "User Commands",
			value:	"To see the leaderboard, use `/leaderboard`\n" +
					"To see your profile, use `/profile`\n" +
					"To see the bot's latency, use `/ping`\n" +
					"To see the leaderboard, use `/leaderboards`"
		}]);
    await interaction.reply({ embeds: [embed] });
};

module.exports.execute = execute;
