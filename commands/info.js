const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");

const execute = async (interaction, client) => {
   let embed = new MessageEmbed()
      .setColor(theme.mainColor)
      .setAuthor(`Requested by ${author.username}`)
      .setTitle("Botinfo Command")
      .setDescription(`**${client.user.username}**'s Information`)
      .addField("Bots Developers", "list of us lol", true)
      .addField("Bots ID", `**${client.user.id}**`, true)
      .addField("Created At", `**${client.user.createdAt}**`, true)
      .addField("Total Servers Joined", `**${client.guilds.cache.size}**`, true)
      .addField("Language", "**node.js** (JavaScript)", true)
      .addField("Library", "**discord.js** v13.6.0", true)
      .addField("Current Latency", `**${client.ws.ping}**ms`, true)
      .addField("Uptime", "Use `/uptime`", true)
      .setFooter("tf we put here lmao")
      .setTimestamp()
    interaction.reply({ embeds: [embed], ephemeral: true })
}

module.exports.execute = execute;