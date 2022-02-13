const { Client, Intents  } = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));

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
client.login(process.env.TOKEN);