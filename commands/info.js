const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");

const execute = async (interaction, client) => {
  let days = Math.floor(client.uptime / 86400000);
  let hours = Math.floor(client.uptime / 3600000) % 24;
  let minutes = Math.floor(client.uptime / 60000) % 60;
  let seconds = Math.floor(client.uptime / 1000) % 60;
   let info = new MessageEmbed()
      .setColor(theme.mainColor)
      .setTitle("Botinfo Command")
      .setDescription(`TerraBot's Information`)
      .addField("Bots Developers", "**4Peace** (388427005764567053), **Olirules10** (442724872326479899), **Taureon** (492665478687490048), **Stuffy** (746994669715587182)", true)
      .addField("Bots ID", `**${client.id}**`, true)
      .addField("Created At", client.createdAt ? `<t:${getTimeInSeconds(client.createdAt)}:D>` : "Unknown", true)
      .addField("Total Servers Joined", `**${client.guilds.cache.size}**`, true)
      .addField("Language", "**node.js** (JavaScript)", true)
      .addField("Library", "**discord.js** v13.6.0", true)
      .addField("Current Latency", `**${Date.now() - interaction.createdTimestamp}**ms`, true)
      .addField("Uptime", `**${days}**d **${hours}**h **${minutes}**m **${seconds}**s`, true)
      .setFooter("tf we put here lmao")
      .setTimestamp()
    interaction.reply({ embeds: [info], ephemeral: true })
}

module.exports.execute = execute;