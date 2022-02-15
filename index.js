const { Client, Intents, Interaction } = require("discord.js");

const helpCommandHandler = require("./commands/help");
const pingCommandHandler = require("./commands/ping");
const leaderboardsCommandHandler = require("./commands/leaderboards");
const profileCommandHandler = require("./commands/profile");
const coinsCommandHandler = require("./commands/coins");
const { notYetImplemented, unknownInteraction, serverError } = require("./standard.responses");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const db  = require("./territorial-db.js");

client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const { commandName } = interaction;

        console.log("Command received: ", commandName);
        console.log("User: ", interaction.user.username);

        switch (commandName) {
            case "help":
                await helpCommandHandler.execute(interaction);
                break;
            case "ping":
                await pingCommandHandler.execute(interaction);
                break;
            case "leaderboard":
                await leaderboardsCommandHandler.execute(interaction, db);
                break;
            case "profile":
                await profileCommandHandler.execute(interaction, db);
                break;
            case "coins":
                const subcommandName = interaction.options.getSubcommand();
                switch (subcommandName) {
                    case "add":
                        await coinsCommandHandler.addCoins(interaction);
                        break;
                    case "remove":
                        await coinsCommandHandler.removeCoins(interaction);
                        break;
                    case "show":
                        await coinsCommandHandler.showUserCoins(interaction);
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
        coinsCommandHandler.confirmButtonHandler(interaction, db);
    } else {
        await unknownInteraction(interaction);
    }
});

client.login(process.env.TOKEN);
