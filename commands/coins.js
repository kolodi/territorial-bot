const { MessageEmbed, Interaction, MessageActionRow, MessageButton } = require("discord.js");
const { theme } = require("../theme");
const { notYetImplemented, unknownInteraction, serverError } = require("../standard.responses");

/**
 * @type Map<Number,  Interaction<CacheType>>
 */
const interactionCache = new Map();

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
 */
async function addCoinsConfirmed(previousInteraction, interaction, db) {
    const options = previousInteraction.options;
    const target = options.getMentionable("user");
    const amount = options.getInteger("amount");
    const reason = options.getString("reason");
    try {
        const userData = (await db.getUserData(target.id)) || {
            coins: 0,
        };
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
    } catch (err) {
        console.error(err);
        await serverError(interaction, "DB Error");
        return;
    }
    await interaction.reply({
        content: `You have added ${amount} coin(s) to <@${target.id}>`,
        ephemeral: true,
    });
    console.log(
        `User ${interaction.user.username} has confirmed adding ${amount} coins to ${target.user.username}.`
    );
}

const showUserCoins = async (interaction, db) => {
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
        const userData = (await db.getUserData(target.id)) || {
            coins: 0,
        };
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

const removeCoinsConfirmed = async (previousInteraction, interaction, db) => {
    const options = previousInteraction.options;
    const target = options.getMentionable("user");
    const amount = options.getInteger("amount");
    const reason = options.getString("reason");
    try {
        const userData = (await db.getUserData(target.id)) || {
            coins: 0,
        };
        const oldCoins = userData.coins;
        const removeAmount = Math.min(oldCoins, amount);
        userData.coins = oldCoins - removeAmount;
        await db.setUserData(target.id, userData);
        await interaction.reply({
            content: `You have removed ${removeAmount} coin(s) from <@${target.id}>`,
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
            `User ${interaction.user.username} has removed ${removeAmount} coins from ${target.user.username}.`
        );
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

const confirmButtonHandler = async (interaction, db) => {
    if (!interactionCache.has(interaction.user.id)) {
        await interaction.reply({ content: "Interaction cache expired", ephemeral: true });
        return;
    }
    const previousInteraction = interactionCache.get(interaction.user.id);
    switch (interaction.customId) {
        case "add_coins_confirm":
            await addCoinsConfirmed(previousInteraction, interaction, db);
            break;
        case "remove_coins_confirm":
            await removeCoinsConfirmed(previousInteraction, interaction, db);
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

module.exports = {
    addCoins,
    removeCoins,
    showUserCoins,
    confirmButtonHandler,
};
