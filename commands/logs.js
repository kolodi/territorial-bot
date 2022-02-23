const { MessageEmbed, CommandInteraction } = require("discord.js");
const { theme } = require("../theme");
const config = require("../config");
const { notYetImplemented, unknownInteraction, serverError } = require("../utils");
const { CommandHandlerOptions, CommandHandler } = require("../types");

/**
 *
 * @param { CommandInteraction } interaction
 * @param { CommandHandlerOptions } opts
 */
const execute = async (interaction, opts) => {
    const { db } = opts;
    const user = interaction.options.getMentionable("user");
    if (!user) {
        await interaction.reply({
            content: "Please mention a user",
            ephemeral: true,
        });
        return;
    }

    try {
        const logs = await db.getLogs(user.id, 10);

        const embed = new MessageEmbed()
            .setColor(theme.mainColor)
            .setTitle(`User Logs`)
            .setDescription(`Target user: <@${user.id}>`)
            .setFooter(`v0.2 Alpha. Stage: ${process.env.STAGE}`)
            .addFields(
                ...logs.map((l) => {
                    const { event_type, user_id, amount, time, reason } = l;
                    const date = new Date();
                    return {
                        name: `<t:${time.seconds}:R>`,
                        value: `**${event_type}** by <@${user_id}>, amount: ${amount}, reason: ${reason}`,
                    };
                })
            );
        await interaction.reply({ embeds: [embed], ephemeral: config.ephemeral });
    } catch (err) {
        console.error(err);
        await serverError(interaction, "DB Error");
    }
};

/**
 * @type { CommandHandler }
 */
const handler = {
    execute,
    permissionLevel: 2,
    slashCMDBuilder: new SlashCommandBuilder()
        .setName("logs")
        .setDescription("Display user logs.")
        .addMentionableOption((opt) =>
            opt.setName("user").setDescription("User to get logs for.").setRequired(true)
        ),
};

module.exports = handler;
