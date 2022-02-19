const { MessageEmbed, Interaction, MessageActionRow, MessageButton } = require("discord.js");
const { theme } = require("../theme");
const config = require ("../config");
const { notYetImplemented, unknownInteraction, serverError } = require("../utils");
const { Caching } = require("../Caching");

/**
 * @type Map<Number,  Interaction<CacheType>>
 */
const interactionCache = new Map();

/**
 *
 * @param {string} userId
 * @param {*} db
 * @param {Caching} cache
 * @returns {import("../types").UserData} UserData
 */
const getUserDataCachedOrDB = async (userId, db, cache) => {
    if (typeof userId !== "string") throw TypeError("coins.getUserDataCachedOrDB: 'userID' is not of type 'string'!");
    const cachedUser = cache.getUserCache(userId);
    if (cachedUser && cachedUser.data) {
        console.log(`User ${userId} found in cache. Coins: ${cachedUser.data.coins}`);
        return cachedUser.data;
    }
    /**
     * @type {import("../types").UserData}
     */
    const userData = (await db.getUserData(userId)) || { coins: 0 };
    cache.setUserDataCache(userId, userData);
    return userData;
};

/**
 *
 * @param { Interaction } interaction
 */
const addCoins = async (interaction) => {
    const options = interaction.options;
    const target = options.getMentionable("user");
    const reason = options.getString("reason");

    if (!target.user || target.user.bot) {
        await interaction.reply({
            content: "Not a real user",
            ephemeral: true,
        });
        return;
    }
    const amount = options.getInteger("amount");
    // const message = `You want to add ${amount} coin(s) to <@${userOpt.id}>?`;
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("add_coins_confirm")
            .setLabel("Confirm")
            .setStyle("PRIMARY"),
        new MessageButton().setCustomId("cancel").setLabel("Cancel").setStyle("SECONDARY")
    );
    const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Add Coins")
        .setFields(
            { name: "target", value: `<@${target.id}>` },
            { name: "amount", value: `${amount} coin(s)` },
            { name: "reason", value: reason }
        );
    console.log(
        `User ${interaction.user.username} wants to add ${amount} coins to ${target.user.username}.`
    );
    interactionCache.set(interaction.user.id, interaction);

    await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true,
    });
};

/**
 *
 * @param {Interaction<CacheType>} previousInteraction
 * @param {Interaction<CacheType>} interaction
 * @param {Caching} cache
 */
async function addCoinsConfirmed(previousInteraction, interaction, db, cache) {
    try {
        const options = previousInteraction.options;
        const target = options.getMentionable("user");
        const amount = options.getInteger("amount");
        const reason = options.getString("reason");
        const userData = await getUserDataCachedOrDB(target.id, db, cache);

        userData.coins += amount;

        await db.setUserData(target.id, userData);
        await db.log({
            guild_id: interaction.guild.id,
            guild_name: interaction.guild.name,
            user_id: interaction.user.id,
            username: interaction.user.username,
            target_id: target.id,
            target_username: target.user.username,
            amount,
            event_type: "add_coins",
            reason,
        });
        cache.invalidtateLeaderboardCache();
        cache.setUserDataCache(target.id, userData);
        await interaction.reply({
            content: `You have added ${amount} coin(s) to <@${target.id}>, new amount: ${userData.coins}`,
            ephemeral: true,
        });
        console.log(
            `User ${interaction.user.username} has confirmed adding ${amount} coins to ${target.user.username}. New amount: ${userData.coins}`
        );
    } catch (err) {
        console.error(err);
        await serverError(interaction, "DB Error");
        return;
    }
}

/**
 *
 * @param {Interaction} interaction
 * @param {*} db
 * @param {Caching} cache
 * @returns
 */
const showUserCoins = async (interaction, db, cache) => {
    const options = interaction.options;
    const target = options.getMentionable("user");
    if (!target.user || target.user.bot) {
        await interaction.reply({
            content: "Not a real user",
            ephemeral: true,
        });
        return;
    }
    try {
        const userData = await getUserDataCachedOrDB(target.id, db, cache);
        console.log(
            `User ${interaction.user.username} wants to see ${target.user.username}'s coins. The amount is ${userData.coins}`
        );
        await interaction.reply({
            content: `<@${target.id}> has ${userData.coins} coin(s)`,
            ephemeral: true,
        });
    } catch (err) {
        console.error(err);
        await serverError(interaction, "DB Error");
        return;
    }
};

/**
 *
 * @param {Interaction} previousInteraction
 * @param {Interaction} interaction
 * @param {*} db
 * @param {Caching} cache
 * @returns
 */
const removeCoinsConfirmed = async (previousInteraction, interaction, db, cache) => {
    try {
        const options = previousInteraction.options;
        const target = options.getMentionable("user");
        const amount = options.getInteger("amount");
        const reason = options.getString("reason");
        const userData = await getUserDataCachedOrDB(target.id, db, cache);

        const oldCoins = userData.coins;
        const removeAmount = Math.min(oldCoins, amount);
        userData.coins = oldCoins - removeAmount;
        await db.setUserData(target.id, userData);
        await interaction.reply({
            content: `You have removed ${removeAmount} coin(s) from <@${target.id}>, new amount: ${userData.coins}`,
            ephemeral: true,
        });
        await db.log({
            guild_id: interaction.guild.id,
            guild_name: interaction.guild.name,
            user_id: interaction.user.id,
            username: interaction.user.username,
            target_id: target.id,
            target_username: target.user.username,
            amount: removeAmount,
            event_type: "remove_coins",
            reason,
        });
        console.log(
            `User ${interaction.user.username} has removed ${removeAmount} coins from ${target.user.username}. New amount: ${userData.coins}`
        );
        cache.invalidtateLeaderboardCache();
        cache.setUserDataCache(target.id, userData);
    } catch (err) {
        console.error(err);
        await serverError(interaction, "DB Error");
        return;
    }
};

const removeCoins = async (interaction) => {
    const options = interaction.options;
    const target = options.getMentionable("user");
    const reason = options.getString("reason");
    if (!target.user || target.user.bot) {
        await interaction.reply({
            content: "Not a real user",
            ephemeral: true,
        });
        return;
    }
    const amount = options.getInteger("amount");
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("remove_coins_confirm")
            .setLabel("Confirm")
            .setStyle("PRIMARY"),
        new MessageButton().setCustomId("cancel").setLabel("Cancel").setStyle("SECONDARY")
    );
    const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Remove Coins")
        .setFields(
            { name: "target", value: `<@${target.id}>` },
            { name: "amount", value: `${amount} coin(s)` },
            { name: "reason", value: reason }
        );
    console.log(
        `User ${interaction.user.username} wants to remove ${amount} coins from ${target.user.username}.`
    );
    interactionCache.set(interaction.user.id, interaction);

    await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true,
    });
};

/**
 *
 * @param {Interaction} interaction
 * @param {*} db
 * @param {Caching} cache
 * @returns
 */
const confirmButtonHandler = async (interaction, db, cache) => {
    if (!interactionCache.has(interaction.user.id)) {
        await interaction.reply({ content: "Interaction cache expired", ephemeral: true });
        return;
    }
    const previousInteraction = interactionCache.get(interaction.user.id);
    switch (interaction.customId) {
        case "add_coins_confirm":
            await addCoinsConfirmed(previousInteraction, interaction, db, cache);
            break;
        case "remove_coins_confirm":
            await removeCoinsConfirmed(previousInteraction, interaction, db, cache);
            break;
        case "cancel":
            await interaction.reply({
                content: `Interaction cancelled`,
                ephemeral: true,
            });
            break;
        default:
            await unknownInteraction(interaction);
            break;
    }
    interactionCache.delete(interaction.user.id);
};

const execute = async (interaction, db, cache) => {
	//ctrl+c & ctrl+v'd from index.js
	switch (interaction.options.getSubcommand()) {
    	case "add":
    	    addCoins(interaction);
    	    break;
    	case "remove":
    	    removeCoins(interaction);
    	    break;
    	case "transfer":
    	    notYetImplemented(interaction);
    	    break;
    	case "show":
    	    showUserCoins(interaction, db, cache);
    	    break;
    	default:
    	    unknownInteraction(interaction);
    	    break;
    }
};

module.exports = {
	execute,
  addCoins,
  removeCoins,
  showUserCoins,
  confirmButtonHandler,
  getUserDataCachedOrDB,
};
