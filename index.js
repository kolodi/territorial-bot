const { Client } = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

bot.on("ready", () => console.log(`Logged in as ${bot.user.tag}.`));

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    switch (commandName) {
        case "help":
            interaction.reply("TBD: List of commands");
            break;
        case "ping":
            interaction.reply("Pong!");
            break;
        case "add-coins":
            interaction.reply("TBD: Add coins to a user.");
            break;
        default:
            interaction.reply("Unknown command.");
            break;
    }
});

// bot.on('message', async message => {
//   return;
// });

require("./server")();
bot.login(config.token);