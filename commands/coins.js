const {
    MessageEmbed,
    Interaction,
    MessageActionRow,
    MessageButton,
    CommandInteraction,
} = require("discord.js");
const { theme } = require("../theme");
const config = require("../config");
const {
    getUserDataCachedOrDB,
    notYetImplemented,
    unknownInteraction,
    serverError,
} = require("../utils");
const { Caching } = require("../Caching");
const { CommandHandler, CommandHandlerOptions } = require("../types");
const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 *
 * @param { CommandInteraction } interaction
 * @param { CommandHandlerOptions } opts
 */
const addCoins = async (interaction, opts) => {
    const { db, cache } = opts;
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
        new MessageButton().setCustomId("confirm").setLabel("Confirm").setStyle("SUCCESS"),
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

    const collector = interaction.channel.createMessageComponentCollector({
        componentType: "BUTTON",
        time: 60000,
        max: 1,
    });

    collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) {
            i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
            return;
        }

        const interactionId = i.customId;

        if (interactionId !== "confirm") {
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
            embeds: [
                new MessageEmbed()
                    .setColor(theme.mainColor)
                    .setTitle("Coins have been added!")
                    .setFields(
                        { name: "Target", value: `<@${target.id}>` },
                        { name: "Added amount", value: `${amount} coins` },
                        { name: "Reason", value: reason },
                        { name: "New amount", value: `${userData.coins} coins` }
                    ),
            ],
            components: [],
            ephemeral: config.ephemeral,
        });
        console.log(
            `User ${interaction.user.username} has confirmed adding ${amount} coins to ${target.user.username}. New amount: ${userData.coins}`
        );
    });

    collector.on("end", (collected) => {
        console.log(`Collected ${collected.size} interactions.`);
    });
};

/**
 *
 * @param {Interaction} interaction
 * @param {CommandHandlerOptions} opts
 * @returns
 */
const showUserCoins = async (interaction, opts) => {
    const { db, cache } = opts;
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

/**
 *
 * @param {CommandInteraction} interaction
 * @param {CommandHandlerOptions} opts
 * @returns
 */
const removeCoins = async (interaction, opts) => {
    const { db, cache } = opts;
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
        new MessageButton().setCustomId("confirm").setLabel("Confirm").setStyle("SUCCESS"),
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

    const collector = interaction.channel.createMessageComponentCollector({
        componentType: "BUTTON",
        time: 60000,
        max: 1,
    });

    collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) {
            i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
            return;
        }

        const interactionId = i.customId;

        if (interactionId !== "confirm") {
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
            embeds: [
                new MessageEmbed()
                    .setColor(theme.mainColor)
                    .setTitle("Coins have been removed!")
                    .setFields(
                        { name: "Target", value: `<@${target.id}>` },
                        { name: "Removed amount", value: `${amount} coins` },
                        { name: "Reason", value: reason },
                        { name: "New amount", value: `${userData.coins} coins` }
                    ),
            ],
            components: [],
            ephemeral: config.ephemeral,
        });
    });

    collector.on("end", (collected) => {
        console.log(`Collected ${collected.size} interactions.`);
    });
};

/**
 *
 * @param {CommandInteraction} interaction
 * @param {CommandHandlerOptions} options
 */
const execute = async (interaction, options) => {
    //ctrl+c & ctrl+v'd from index.js
    switch (interaction.options.getSubcommand()) {
        case "add":
            addCoins(interaction, options);
            break;
        case "remove":
            removeCoins(interaction, options);
            break;
        case "transfer":
            notYetImplemented(interaction);
            break;
        case "show":
            showUserCoins(interaction, options);
            break;
        default:
            unknownInteraction(interaction);
            break;
    }
};

/**
 * @type {CommandHandler}
 */
const handler = {
    slashCMDBuilder: new SlashCommandBuilder()
        .setName("coins")
        .setDescription("add/remove/show coins for a user")
        .addSubcommand((sub) =>
            sub .setName("add")
                .setDescription("add coins to a user")
                .addMentionableOption((opt) =>
                    opt .setName("user")
                        .setDescription("The user to add coins to.")
                        .setRequired(true)
                )
                .addIntegerOption((opt) =>
                    opt .setName("amount")
                        .setDescription("The amount of coins to add.")
                        .setRequired(true)
                        .setMinValue(10)
                        .setMaxValue(1000)
                )
                .addStringOption((opt) =>
                    opt .setName("reason")
                        .setDescription("Describe the reason for adding coins.")
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub .setName("remove")
                .setDescription("remove coins from a user")
                .addMentionableOption((opt) =>
                    opt .setName("user")
                        .setDescription("The user to remove coins from.")
                        .setRequired(true)
                )
                .addIntegerOption((opt) =>
                    opt .setName("amount")
                        .setDescription("The amount of coins to remove.")
                        .setRequired(true)
                        .setMinValue(10)
                        .setMaxValue(1000)
                )
                .addStringOption((opt) =>
                    opt .setName("reason")
                        .setDescription("Describe the reason for removing coins.")
                        .setRequired(true)
                )
        )

        .addSubcommand((sub) =>
            sub .setName("transfer")
                .setDescription("Move coins from one user to another.")
                .addMentionableOption((opt) =>
                    opt .setName("from")
                        .setDescription("The user to remove coins from for transfer.")
                        .setRequired(true)
                )
                .addMentionableOption((opt) =>
                    opt .setName("to")
                        .setDescription("The user to transfer the coins to.")
                        .setRequired(true)
                )
                .addIntegerOption((opt) =>
                    opt .setName("amount")
                        .setDescription("The amount of coins to transfer.")
                        .setRequired(true)
                        .setMinValue(10)
                        .setMaxValue(1000)
                )
                .addStringOption((opt) =>
                    opt .setName("reason")
                        .setDescription("Describe the reason for transfering coins.")
                        .setRequired(true)
                )
        )

        .addSubcommand((sub) =>
            sub .setName("show")
                .setDescription("show amount of coins for a user")
                .addMentionableOption((opt) =>
                    opt .setName("user")
                        .setDescription("The target user.")
                        .setRequired(true)
                )
        ),
    execute,
    permissionLevel: 1,
};

module.exports = handler;
