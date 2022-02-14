const {
    Client,
    Intents,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    Interaction,
} = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const { getUserData, setUserData, coinsLeaderboard } = require("./territorial-db.js");

client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));

/**
 * @type Map<Number,  Interaction<CacheType>>
 */
const interactionCache = new Map();

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const { commandName } = interaction;

        console.log("Command received: ", commandName);
        console.log("User: ", interaction.user.username);

        switch (commandName) {
            case "help":
                await notYetImplemented(interaction);
                break;
            case "ping":
                await interaction.reply({ content: "Pong!", ephemeral: true });
                break;
            case "leaderboard":
                await showLeaderboard(interaction);
                break;
            case "coins":
                const subcommandName = interaction.options.getSubcommand();
                switch (subcommandName) {
                    case "add":
                        await addCoins(interaction);
                        break;
                    case "remove":
                        await removeCoins(interaction);
                        break;
                    case "show":
                        await showUserCoins(interaction);
                        break;
                    default:
                        await unknownInteraction(interaction);
                        break;
                }
                break;
            default:
                await unknownInteraction(interaction);
                break;
        } // end commands switch
    } else if (interaction.isButton()) {
        // for now buttons are only used for commands that require confirmation
        if (!interactionCache.has(interaction.user.id)) {
            await interaction.reply({ content: "Interaction cache expired", ephemeral: true });
            return;
        }
        const previousInteraction = interactionCache.get(interaction.user.id);
        switch (interaction.customId) {
            case "add_coins_confirm":
                await addCoinsConfirmed(previousInteraction, interaction);
                break;
            case "remove_coins_confirm":
                await removeCoinsConfirmed(previousInteraction, interaction);
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
    } else {
        await unknownInteraction(interaction);
    }
});

const addCoins = async (interaction) => {
    const options = interaction.options;
    const target = options.getMentionable("user");
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
        .setURL("https://discord.js.org")
        .setFields(
            { name: "target", value: `<@${target.id}>` },
            { name: "amount", value: `${amount} coin(s)` }
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
async function addCoinsConfirmed(previousInteraction, interaction) {
    const options = previousInteraction.options;
    const target = options.getMentionable("user");
    const amount = options.getInteger("amount");
    try {
        const userData = (await getUserData(target.id)) || {
            coins: 0,
        };
        userData.coins += amount;
        await setUserData(target.id, userData);
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

const showUserCoins = async (interaction) => {
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
        const userData = (await getUserData(target.id)) || {
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

const removeCoinsConfirmed = async (previousInteraction, interaction) => {
    const options = previousInteraction.options;
    const target = options.getMentionable("user");
    const amount = options.getInteger("amount");
    try {
        const userData = (await getUserData(target.id)) || {
            coins: 0,
        };
        const oldCoins = userData.coins;
        const removeAmount = Math.min(oldCoins, amount);
        userData.coins = oldCoins - removeAmount;
        await setUserData(target.id, userData);
        await interaction.reply({
            content: `You have removed ${removeAmount} coin(s) from <@${target.id}>`,
            ephemeral: true,
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
        .setURL("https://discord.js.org")
        .setFields(
            { name: "target", value: `<@${target.id}>` },
            { name: "amount", value: `${amount} coin(s)` }
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

const showLeaderboard = async (interaction) => {
    const options = interaction.options;
    const limit = options.getInteger("limit") || 10;
    const ephimeral = !(options.getBoolean("chat") || false);

    console.log(`getting top ${limit} users, user only see: ${ephimeral}`);
    try {
        const records = await coinsLeaderboard(limit);

        // joins all user ids into string with each id in a new line
        const userIds = records.map((record) => `<@${record.userId}>`);
        const userIdsString = userIds.join("\n");
        // do the same to coins
        const coins = records.map((record) => record.coins);
        const coinsString = coins.join("\n");
        const places = records.map((record, index) => index + 1);
        const placesString = places.join("\n");
        const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Leaderboard")
            .addField("#", placesString, true)
            .addField("User", userIdsString, true)
            .addField("Coins", coinsString, true);
        await interaction.reply({ embeds: [embed], ephemeral: ephimeral });
    } catch (err) {
        console.error(err);
        await serverError(interaction, "DB Error");
    }
};

const notYetImplemented = async (interaction) => {
    await interaction.reply({ content: "Not yet implemented.", ephemeral: true });
};

const unknownInteraction = async (interaction) => {
    await interaction.reply({ content: "Unknown interaction", ephemeral: true });
};

const serverError = async (interaction, msg) => {
    await interaction.reply({ content: msg || "Server error", ephemeral: true });
};

client.login(process.env.TOKEN);
