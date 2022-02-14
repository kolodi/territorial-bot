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
                await interaction.reply({ content: "TBD: List of commands", ephemeral: true });
                break;
            case "ping":
                await interaction.reply("Pong!");
                break;
            case "add-coins":
                const options = interaction.options;
                const userOpt = options.getMentionable("user");
                if (!userOpt.user) {
                    await interaction.reply({
                        content: "You must mention a user.",
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
                    new MessageButton()
                        .setCustomId("cancel")
                        .setLabel("Cancel")
                        .setStyle("SECONDARY")
                );
                const embed = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Add Coins")
                    .setURL("https://discord.js.org")
                    .setFields(
                        { name: "target", value: `<@${userOpt.id}>` },
                        { name: "amount", value: `${amount} coin(s)` }
                    );
                console.log(
                    `User ${interaction.user.username} wants to add ${amount} coins to ${userOpt.user.username}.`
                );
                interactionCache.set(interaction.user.id, interaction);

                await interaction.reply({
                    embeds: [embed],
                    components: [row],
                    ephemeral: true,
                });
                break;
            default:
                await interaction.reply("Unknown command.");
                break;
        }
    } else if (interaction.isButton()) {
        // for now buttons are only used for commands that require confirmation
        if (!interactionCache.has(interaction.user.id)) {
            await interaction.reply({ content: "Interaction cache expired", ephemeral: true });
            return;
        }
        const previousInteraction = interactionCache.get(interaction.user.id);
        switch (interaction.customId) {
            case "add_coins_confirm":
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
                break;
            case "cancel":
                await interaction.reply({
                    content: `Interaction cancelled`,
                    ephemeral: true,
                });
                break;
            default:
                await interaction.reply({
                    content: "Unknown button pressed",
                    ephemeral: true,
                });
                break;
        }
        interactionCache.delete(interaction.user.id);
    } else {
        await interaction.reply({ content: "Unknown interaction.", ephemeral: true });
    }
});

client.login(process.env.TOKEN);
