const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
const config = require ("../config");
const { getUserDataCachedOrDB, notYetImplemented, unknownInteraction, serverError } = require("../utils");
const { Caching } = require("../Caching");
/**
 *
 * @param { Interaction } interaction
 * @param { any } db
 * @param { Caching } cache
 */
const execute = async (interaction, db, cahce) => {
    const { user } = interaction;
    const userData = await getUserDataCachedOrDB(user.id, db, cahce);
    const embed = new MessageEmbed()
        .setColor(theme.mainColor)
        .setFooter(`v0.2 Alpha. Stage: ${process.env.STAGE}`)
        .setTitle(`${user.username}'s Profile`)
        .setDescription(`You have ${userData.coins} coins`);
    await interaction.reply({ embeds: [embed], ephemeral: config.ephemeral });
};

module.exports.execute = execute;
