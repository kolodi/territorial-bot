const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
const config = require("../config");
const { notYetImplemented, unknownInteraction, serverError } = require("../utils");
const { CommandHandlerOptions, CommandHandler } = require("../types");

/**
 *
 * @param { Interaction } interaction
 * @param { CommandHandlerOptions } opts
 */
const execute = async (interaction, opts) => {
    const { db, cache } = opts;
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
            .setFooter(`v0.2 Alpha. Stage: ${process.env.STAGE}`)
            // .addField("Rank", placesString, true)
            .addField("User", userIdsString, true)
            .addField("Coins", coinsString, true);
        await interaction.reply({ embeds: [embed], ephemeral: ephimeral });
    } catch (err) {
        console.error(err);
        await serverError(interaction, "Server Error");
    }
};

/**
 * @type { CommandHandler }
 */
const handler = {
    execute,
    permissionLevel: 0,
    slashCMDBuilder: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows leaderboard.")
        .addBooleanOption((opt) =>
            opt
                .setName("chat")
                .setDescription("Display in chat for everyone to see (default false)")
        )
        .addIntegerOption((opt) =>
            opt
                .setName("limit")
                .setDescription("The number of users to show (default 10)")
                .setMinValue(10)
                .setMaxValue(100)
        ),
};

module.exports = handler;
