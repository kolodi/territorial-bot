const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));

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
                const message = `You want to add ${amount} coins to <@${userOpt.id}>?`;
                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId("confirm_add")
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
                    .setDescription(message);
                console.log(message);
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
      await interaction.reply({content: "Button pressed", ephemeral: true});
    } else {
      await interaction.reply({content: "Unknown interaction.", ephemeral: true});
    }
});

client.on("message", async (message) => {
    console.log(message.content);
    //message.reply("Hello!");
});

require("./server")();
client.login(process.env.TOKEN);
