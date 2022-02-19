const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
const config = require("../config");
const { getTimeInSeconds } = require("../utils");

const devs = ["388427005764567053", "442724872326479899", "492665478687490048", "746994669715587182"];

const execute = async (interaction, db, cache, client, totalCommandCounter) => {
  const days = Math.floor(client.uptime / 86400000);
  const hours = Math.floor(client.uptime / 3600000) % 24;
  const minutes = Math.floor(client.uptime / 60000) % 60;
  const seconds = Math.floor(client.uptime / 1000) % 60;
  console.log(JSON.stringify(client.application, null, 2));
  const info = new MessageEmbed()
      .setColor(theme.mainColor)
      .setTitle("Botinfo Command")
      .setDescription(`TerraBot's Information`)
      .addField("Bots Developers", devs.map(d => `<@${d}>`).join(", "), true)
      .addField("Bots ID", `**${client.id}**`, true)
      .addField("Created At", `<t:${getTimeInSeconds(client.application.createdTimestamp)}:D>`, true)
      .addField("Language", "**JavaScript** (node v16)", true)
      .addField("Library", "**discord.js** v13.6.0", true)
      .addField("Current Latency", `**${Date.now() - interaction.createdTimestamp}**ms`, true)
      .addField("Uptime", `**${days}**d **${hours}**h **${minutes}**m **${seconds}**s`, true)
      .setFooter(`v0.1 Alpha. Stage: ${process.env.STAGE}`)
      .setTimestamp();
  interaction.reply({ embeds: [info], ephemeral: config.ephemeral });
}

module.exports.execute = execute;

/**
 * const btnRowM1 = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Menu 1 Embed 1')
        .setStyle("PRIMARY")
        .setCustomId("info"),
      new MessageButton()
        .setLabel('Menu 1 Embed 2')
        .setStyle("PRIMARY")
        .setCustomId("uptime"),
      new MessageButton()
        .setLabel('Menu 1 Embed 3')
        .setStyle("PRIMARY")
        .setCustomId("ping"),
    )
 */