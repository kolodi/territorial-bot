const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
const { notYetImplemented, unknownInteraction, serverError } = require("../utils");
/**
 *
 * @param { Interaction } interaction
 * @param { any } db
 * @param { import("../types").UserCache } cache
 */
const execute = async (interaction, db, cache) => {
    const options = interaction.options;
    const limit = options.getInteger("limit") || 10;
    const ephimeral = !(options.getBoolean("chat") || false);
    try {
        let top100 = [];
        const cachedLeaderboard = cache.leaderboard;
        if (cachedLeaderboard.length > 0) {
            console.log(`Getting top ${limit} users from Cache`);
            top100 = cachedLeaderboard;
        } else {
            console.log(`Getting top ${limit} users from DB`);
            top100 = await db.coinsLeaderboard(100);
            cache.leaderboard = top100;
        }

        const records = top100.slice(0, limit);

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
            // .addField("Rank", placesString, true)
            .addField("User", userIdsString, true)
            .addField("Coins", coinsString, true);
        await interaction.reply({ embeds: [embed], ephemeral: ephimeral });
    } catch (err) {
        console.error(err);
        await serverError(interaction, "Server Error");
    }
};

module.exports.execute = execute;
