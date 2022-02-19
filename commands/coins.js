const { MessageEmbed, Interaction, MessageActionRow, MessageButton, CommandInteraction } = require("discord.js");
const { theme } = require("../theme");
const config = require ("../config");
const { notYetImplemented, unknownInteraction, serverError } = require("../utils");
const { Caching } = require("../Caching");

/**
 *
 * @param {string} userId
 * @param {*} db
 * @param {Caching} cache
 * @returns {import("../types").UserData} UserData
 */
const getUserDataCachedOrDB = async (userId, db, cache) => {
    if (typeof userId !== "string") throw TypeError("coins.getUserDataCachedOrDB: 'userID' is not of type 'string'!");
    const cachedUser = cache.getUserCache(userId); // lol
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
 * @param { CommandInteraction } interaction
 */
const addCoins = async (interaction, db, cache) => {
    const options = interaction.options;
    const target = options.getMentionable("user");
    const reason = options.getString("reason");
    const amount = options.getInteger("amount");

    if (!target.user || target.user.bot) {
        await interaction.reply({
            content: "Not a real user",
            ephemeral: true,
        });
        return;
    }
    // const message = `You want to add ${amount} coin(s) to <@${userOpt.id}>?`;
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("confirm")
            .setLabel("Confirm")
            .setStyle("SUCCESS"),
        new MessageButton().setCustomId("cancel").setLabel("Cancel").setStyle("DANGER")
    );
    const embed = new MessageEmbed()
        .setColor(config.mainColor)
        .setTitle("Add Coins")
        .setFields(
            { name: "Target", value: `<@${target.id}>` },
            { name: "Amount", value: `${amount} coin(s)` },
            { name: "Reason", value: reason }
        );
    console.log(
        `User ${interaction.user.username} wants to add ${amount} coins to ${target.user.username}.`
    );

    await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: config.ephemeral,
    });

    const collector = interaction.channel.createMessageComponentCollector({componentType: "BUTTON", time: 60000, max: 1});

    collector.on("collect", async i => {
        if (i.user.id !== interaction.user.id) {
          i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
          return;
        }

        const interactionId = i.customId;

        if(interactionId !== "confirm") {
          i.reply({ content: `Operation cancelled`, ephemeral: true });
          return;
        }

            
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
        await i.update({
            embeds: [new MessageEmbed()
              .setColor(theme.mainColor)
              .setTitle("Coins have been added!")
              .setFields(
                  { name: "Target", value: `<@${target.id}>` },
                  { name: "Added amount", value: `${amount} coins` },
                  { name: "Reason", value: reason },
                  { name: "New amount", value: `${userData.coins} coins` },
              )],
            components: [],
            ephemeral: config.ephemeral,
        });
        console.log(
            `User ${interaction.user.username} has confirmed adding ${amount} coins to ${target.user.username}. New amount: ${userData.coins}`
        );
    });
    
    collector.on('end', collected => {
        console.log(`Collected ${collected.size} interactions.`);
    });
};

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
    const userData = await getUserDataCachedOrDB(target.id, db, cache);
    console.log(
        `User ${interaction.user.username} wants to see ${target.user.username}'s coins. The amount is ${userData.coins}`
    );
    await interaction.reply({
        content: `<@${target.id}> has ${userData.coins} coin(s)`,
        ephemeral: config.ephemeral,
    });
};

const removeCoins = async (interaction, db, cache) => {
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
            .setCustomId("confirm")
            .setLabel("Confirm")
            .setStyle("SUCCESS"),
        new MessageButton().setCustomId("cancel").setLabel("Cancel").setStyle("DANGER")
    );
    const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Remove Coins")
        .setFields(
            { name: "Target", value: `<@${target.id}>` },
            { name: "Amount", value: `${amount} coins` },
            { name: "Reason", value: reason }
        );
    console.log(
        `User ${interaction.user.username} wants to remove ${amount} coins from ${target.user.username}.`
    );

    await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: config.ephemeral,
    });

    const collector = interaction.channel.createMessageComponentCollector({componentType: "BUTTON", time: 60000, max: 1});

    collector.on("collect", async i => {
        if (i.user.id !== interaction.user.id) {
          i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
          return;
        }

        const interactionId = i.customId;

        if(interactionId !== "confirm") {
          i.reply({ content: `Operation cancelled`, ephemeral: true });
          return;
        }

            
        const userData = await getUserDataCachedOrDB(target.id, db, cache);

        const oldCoins = userData.coins;
        const removeAmount = Math.min(oldCoins, amount);
        userData.coins = oldCoins - removeAmount;
        await db.setUserData(target.id, userData);
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
        await i.update({
            embeds: [new MessageEmbed()
              .setColor(theme.mainColor)
              .setTitle("Coins have been removed!")
              .setFields(
                  { name: "Target", value: `<@${target.id}>` },
                  { name: "Removed amount", value: `${amount} coins` },
                  { name: "Reason", value: reason },
                  { name: "New amount", value: `${userData.coins} coins` },
              )],
            components: [],
            ephemeral: config.ephemeral,
        });
    });
    
    collector.on('end', collected => {
        console.log(`Collected ${collected.size} interactions.`);
    });
};

const execute = async (interaction, db, cache) => {
	//ctrl+c & ctrl+v'd from index.js
	switch (interaction.options.getSubcommand()) {
    	case "add":
    	    addCoins(interaction, db, cache);
    	    break;
    	case "remove":
    	    removeCoins(interaction, db, cache);
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
  getUserDataCachedOrDB,
};
