const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const commands = [
  {
    name: 'help',
    description: 'Shows the list of commands or help on specified command.',
    format: 'help [command-name]'
  },
  {
    name: 'ping',
    description: 'Checks connectivity with discord\'s servers.',
    format: 'ping'
  },
  {
    name: 'add coins',
    aliases: ['add-points'],
    description: 'Add coins to a user',
    format: 'add coins <user mention> <amount>'
  }
];

const rest = new REST({version: '9'}).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.APP_ID), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();