const {readdirSync} = require('fs');

const config = {
	//get all files in "./commands" and remove the last 3 characters of them (usually ".js")
    commands: readdirSync('./commands').map(fn => fn.slice(0, -3)),
    admin_commands: ["coins", "ping", "logs", "whois", "uptime", "reload", "purge"], // reload is special as it is not in the list of all commands
    ephemeral: process.env.STAGE !== "DEV",
};

module.exports = config;