const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
const config = require("../config");
const { getUserDataCachedOrDB } = require("../utils");
const { CommandHandlerOptions } = require("../types");

/**
 *
 * @param { Interaction } interaction
 * @param { CommandHandlerOptions } opts
 */
const execute = async (interaction, opts) => {
    const { db, cache } = opts;
    const { user } = interaction;
    const userData = await getUserDataCachedOrDB(user.id, db, cache);
    const embed = new MessageEmbed()
        .setColor(theme.mainColor)
        .setFooter(`v0.2 Alpha. Stage: ${process.env.STAGE}`)
        .setTitle(`${user.username}'s Profile`)
        .setDescription(`You have ${userData.coins} coins`);
    await interaction.reply({ embeds: [embed], ephemeral: config.ephemeral });
};

/**
 * @type { CommandHandler }
 */
const handler = {
    execute,
    permissionLevel: 0,
    slashCMDBuilder: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Check your profile."),
};

module.exports = handler;
