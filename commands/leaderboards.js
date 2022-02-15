const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
const { notYetImplemented, unknownInteraction, serverError } = require("../standard.responses");
/**
 *
 * @param { Interaction } interaction
 * @param { any } db
 */
const execute = async (interaction, db) => {
    const options = interaction.options;
    const limit = options.getInteger("limit") || 10;
    const ephimeral = !(options.getBoolean("chat") || false);

    console.log(`getting top ${limit} users, user only see: ${ephimeral}`);
    try {
        const records = await db.coinsLeaderboard(limit);

        // joins all user ids into string with each id in a new line
        const userIds = records.map((record, index) => `#${index + 1} <@${record.userId}> `);
        const userIdsString = userIds.join("\n");
        // do the same to coins
        const coins = records.map((record) => record.coins);
        const coinsString = coins.join("\n");
        // const places = records.map((record, index) => index + 1);
        // const placesString = places.join("\n");
        const embed = new MessageEmbed()
            .setColor(theme.mainColor)
            .setTitle("Leaderboard")
            // .addField("#", placesString, true)
            .addField("User", userIdsString, true)
            .addField("Coins", coinsString, true);
        await interaction.reply({ embeds: [embed], ephemeral: ephimeral });
    } catch (err) {
        console.error(err);
        await serverError(interaction, "DB Error");
    }
};

module.exports.execute = execute;
