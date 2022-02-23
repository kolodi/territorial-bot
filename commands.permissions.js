const { Client, Intents } = require("discord.js");
const config = require("./config");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const roleId = "944301303734104145"; // coin master on dev server
const permissions = [{
    id: roleId,
    type: "ROLE",
    permission: true,
}];

const roleCommands = config.admin_commands;

const guildId = "944273910923427920"; // dev server 
const token = process.env.TOKEN;

/**
 * This will grant permissions to the admin commands for 1 the specified role.
 * You run this script once and it will gives the permissions, probably you need
 * another script to revoke the permissions.
 * this looks very weird
 */
const setPermissions = async () => {
    console.log(token);
    console.log(guildId);

    // login to bot
    await client.login(token);
    //dont we like already have a client logged in in index.js? it is for running bot, here we need to login once to be able to retrieve data from the bot
    // get data for the specific guild (discord server) where your bot is added
    const cache = await client.guilds.cache.get(guildId);

    // get the list of registered commands
    const commands = await cache.commands.fetch();
    for (const command of commands.values()) {
        if (roleCommands.includes(command.name)) {
            console.log(command.name);
            //cant we do a line that removes the permission before setting it so we dont need to make a second script specifically to delete perms?
            // yes, we will update this script once we have the permission map and it will remove all permissions from a command before adding, so each time you run it it will update them
            const result = await command.permissions.set({ permissions }); // command object has a method to set the permision, it all works like a charm
            // lets forcus on command handler first... we will turn back to this later
            console.log(result);
        }
    }
};

setPermissions();
