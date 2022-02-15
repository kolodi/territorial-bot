const { Client, Intents } = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const roleId = "942898354923389038";
const permissions = [
    {
        id: roleId,
        type: "ROLE",
        permission: true,
    },
];

const setPermissions = async () => {
    await client.login(process.env.TOKEN);
    const cache = await client.guilds.cache.get(process.env.GUILD_ID);
    const commands = await cache.commands.fetch();
    for (const command of commands.values()) {
        if (command.name === "coins") {
            console.log(command.name);
            const result = await command.permissions.set({permissions});
            console.log(result);
        }
    }
};

setPermissions();
