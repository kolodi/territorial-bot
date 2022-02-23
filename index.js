const { Client, Intents, Interaction } = require("discord.js");
const express = require("express");
const app = express();
const fs = require('fs');
const config = require("./config");
const { notYetImplemented, unknownInteraction, serverError } = require("./utils");
const db = require("./territorial-db.js");
const { Caching } = require("./Caching");


app.listen(3000, () => {
  console.log("Project is running!");
})

app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: __dirname
  });
});

const reloadCommandHandler = {
	execute: async interaction => {
    	const commandNameToReload = interaction.options.getString("name");
		if (fs.existsSync('./commands/' + commandNameToReload + ".js")) {
			//https://stackoverflow.com/a/15666221/10793061
			delete require.cache[require.resolve('./commands/' + commandNameToReload + '.js')];
			commands.set(commandNameToReload, require('./commands/' + commandNameToReload));
			interaction.reply({content: `reloaded: \`${commandNameToReload}\``});
		} else {
			interaction.reply({content: `command does not exist: \`${commandNameToReload}\``});
		}
	}
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
	client.user.setActivity('you. Im in your walls.', { type: 'WATCHING' })
})

const allCommands = config.commands;
console.log("Commands List: ", allCommands.join(', '));
/**
 * @type {Map<string, CommandHandler>}
 */
const commands = new Map(
	allCommands.map(command => ([command, require("./commands/" + command)]))
);
commands.set("reload", reloadCommandHandler); // adding special reload command

let totalCommandCounter = 0;
const startTime = new Date();

const cooldownPeriod = process.env.STAGE === "DEV" ? 1 : 60;
const cache = new Caching(1);

const adminCommands = config.admin_commands;
const checkIfAdminCommand = commandName => adminCommands.includes(commandName);

client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
      totalCommandCounter++;

      const { commandName, user } = interaction;
      const isAdminCommand = checkIfAdminCommand(commandName);
      const isUserInCooldown = cache.isUserInCooldown(user.id);

      if (!isAdminCommand && isUserInCooldown) {
          interaction.reply({
              content: `You are in cooldown. Please wait at least 1 minute between commands`,
              ephemeral: true,
          });
          return;
      }

    	console.log(`#${totalCommandCounter} User ${user.username} invoked command ${commandName}`);

      const commandHandler = commands.get(commandName);
      if (!commandHandler) {
        await unknownInteraction(interaction);
        return;
      }

      try {
        await commandHandler.execute(interaction, db, cache, client, totalCommandCounter);
      } catch(err) {
        console.error(commandName, err);
        //await interaction.update("Something went wrong");
        return;
      }
		
      if (!isAdminCommand) {
          cache.setUserLastCommandCall(user.id);
      }

    }
});

client.login(process.env.TOKEN);