const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
const { notYetImplemented, unknownInteraction, serverError } = require("../standard.responses");
/**
 *
 * @param { Interaction } interaction
 */
const execute = async (interaction, db) => {
    const user = interaction.user;
    const userData = (await db.getUserData(user.id)) || {
        coins: 0,
    };
    const embed = new MessageEmbed()
        .setColor(theme.mainColor)
        .setTitle(`${user.username}'s Profile`)
        .setDescription(`You have ${userData.coins} coin(s)`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
};

module.exports.execute = execute;
