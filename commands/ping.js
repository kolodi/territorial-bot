const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
/**
 *
 * @param { Interaction } interaction
 */
const execute = async (interaction) => {
    const embed = new MessageEmbed()
        .setColor(theme.mainColor)
        .setTitle("Ping")
        .setDescription("Hello, I am Territorial Bot.");
    await interaction.reply({ embeds: [embed], ephemeral: true });
};

module.exports.execute = execute;
