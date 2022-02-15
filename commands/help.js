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
        .setDescription(
            "**Territorial Bot.**\n\n" +
                "**Admin comnands:**\n" +
                "To add coins to a user, use the command `/coins add`\n" +
                "To remove coins from a user, use the command `/coins remove`\n" +
                "To see the coins of a user, use the command `/coins show`\n\n" +
                "**User comnands:**\n" +
                "To see the leaderboard, use the command `/leaderboard` \n" +
                "To see your own profile, use the command `/profile`"
        );
    await interaction.reply({ embeds: [embed], ephemeral: true });
};

module.exports.execute = execute;
