const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

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
                await interaction.reply("Pong!");
                break;
            case "coins":
                const subcommandName = interaction.options.getSubcommand();
                switch (subcommandName) {
                    case "add":
                        await addCoins(interaction);
                        break;
                    case "remove":
                        await notYetImplemented(interaction);
                        break;
                    case "show":
                        await notYetImplemented(interaction);
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

async function addCoinsConfirmed(previousInteraction, interaction) {
    const options = previousInteraction.options;
    const target = options.getMentionable("user");
    const amount = options.getInteger("amount");
    await interaction.reply({
        content: `You have added ${amount} coin(s) to <@${target.id}>`,
        ephemeral: true,
    });
    console.log(
        `User ${target.username} has confirmed adding ${amount} coins to ${target.username}.`
    );
}

const notYetImplemented = async (interaction) => {
    await interaction.reply({ content: "Not yet implemented.", ephemeral: true });
};

const unknownInteraction = async (interaction) => {
    await interaction.reply({ content: "Unknown interaction", ephemeral: true });
};

client.login(process.env.TOKEN);
