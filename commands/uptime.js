const { MessageEmbed, Interaction } = require("discord.js");

const execute = async (interaction, client, totalCommandCounter) => {
  
  let days = Math.floor(client.uptime / 86400000);
  let hours = Math.floor(client.uptime / 3600000) % 24;
  let minutes = Math.floor(client.uptime / 60000) % 60;
  let seconds = Math.floor(client.uptime / 1000) % 60;

  let embed = new Discord.MessageEmbed()
    .setAuthor(`Requested by ${message.author.tag}`)
    .setTitle("Uptime Command")
    .addField(":timer: TerraBot's Uptime:", `**${days}**d **${hours}**h **${minutes}**m **${seconds}**s`)
    .addField(":notepad_spiral: Commands Used", `The total amount of commands used since last restart is **${totalCommandCounter}**`)
    .setColor("RANDOM")
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: false });
};

module.exports.execute = execute;

// await interaction.reply({content: `The bot is on since <t:${startTime.getTime()/ 1000 | 0}:R>. The number of commands invoked so far: ${totalCommandCounter}. Users in cache: ${cache.cacheSize}`, ephemeral: false});