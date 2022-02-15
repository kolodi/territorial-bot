const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
const { notYetImplemented, unknownInteraction, serverError } = require("../standard.responses");
/**
 *
 * @param { Interaction } interaction
 * @param { any } db
 */
const execute = async (interaction, db) => {
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
        await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
        console.error(err);
        await serverError(interaction, "DB Error");
    }
};

module.exports.execute = execute;
