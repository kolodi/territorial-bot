const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
const { notYetImplemented, unknownInteraction, serverError } = require("../standard.responses");
const { getUserDataCachedOrDB } = require("./coins");
const { Caching } = require("../Caching");
/**
 *
 * @param { Interaction } interaction
 * @param { any } db
 * @param { Caching } cache
 */
const execute = async (interaction, db, cahce) => {
    const user = interaction.user;
    const userData = await getUserDataCachedOrDB(user.id, db, cahce);
    const embed = new MessageEmbed()
        .setColor(theme.mainColor)
        .setTitle(`${user.username}'s Profile`)
        .setDescription(`You have ${userData.coins} coin(s)`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
};

module.exports.execute = execute;
