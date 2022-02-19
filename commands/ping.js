const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
/**
 *
 * @param { Interaction } interaction
 */
const execute = async (interaction, client) => {

  let pingembed = new MessageEmbed()
      .setTitle("Ping Command")
      .setDescription(`:desktop: **Ping - ${Date.now() - interaction.createdTimestamp} ms**`)
      .setColor("#42F400")
      .setFooter("TerraBot | vi.d.k")
      .setTimestamp();
    await interaction.reply({ content: `Showing ${interaction.user}'s ping to discord:`, embeds: [pingembed], ephemeral: false });
}

module.exports = { execute };
