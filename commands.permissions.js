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

const setPermissions = async () => {
    console.log(token);
    console.log(guildId);

    await client.login(token);
    const cache = await client.guilds.cache.get(guildId);
    const commands = await cache.commands.fetch();
    for (const command of commands.values()) {
        if (roleCommands.includes(command.name)) {
            console.log(command.name);
            const result = await command.permissions.set({ permissions });
            console.log(result);
        }
    }
};

setPermissions();
