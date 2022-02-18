const { Client, Intents, Interaction } = require("discord.js");

const helpCommandHandler = require("./commands/help");
const pingCommandHandler = require("./commands/ping");
const leaderboardsCommandHandler = require("./commands/leaderboards");
const profileCommandHandler = require("./commands/profile");
const coinsCommandHandler = require("./commands/coins");
const logsCommandHandler = require("./commands/logs");

const { notYetImplemented, unknownInteraction, serverError } = require("./standard.responses");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
//const db = require("./territorial-db.js");
const db = {};

const { Caching } = require("./Caching");

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

let totalCommandCounter = 0;

const cache = new Caching(60);

const adminCommands = ["coins", "logs"];
const checkIfAdminCommand = (commandName) => adminCommands.includes(commandName);

client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        totalCommandCounter++;

        const { commandName, user } = interaction;

        const isAdminCommand = checkIfAdminCommand(commandName);
        const isUserInCooldown = cache.isUserInCooldown(user.id);

        if (!isAdminCommand && isUserInCooldown) {
            await interaction.reply({
                content: `You are in cooldown. Please wait at least 1 minute between commands`,
                ephemeral: true,
            });
            return;
        }

        console.log(`#${totalCommandCounter} User ${user.username} invoked command ${commandName}`);

        switch (commandName) {
            case "help":
                await helpCommandHandler.execute(interaction);
                break;
            case "ping":
                await pingCommandHandler.execute(interaction);
                break;
            case "logs":
                await logsCommandHandler.execute(interaction, db);
                break;
            case "leaderboard":
                await leaderboardsCommandHandler.execute(interaction, db, cache);
                break;
            case "profile":
                await profileCommandHandler.execute(interaction, db, cache);
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
                        await coinsCommandHandler.showUserCoins(interaction, db, cache);
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
        if (!isAdminCommand) {
            cache.setUserLastCommandCall(user.id);
        }
    } else if (interaction.isButton()) {
        // for now buttons are only used for commands that require confirmation
        coinsCommandHandler.confirmButtonHandler(interaction, db, cache);
    } else {
        await unknownInteraction(interaction);
    }
});

client.login(process.env.TOKEN);
