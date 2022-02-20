const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");

const execute = async (interaction, db, cache, client) => {
    const options = interaction.options;
    const clear = options.getInteger("clear") || 10;
  // let arg = message.content.split(" ")
      // let clear = arg[1];
      let noi = new MessageEmbed()
        .setTitle("Purge Command")
        .setDescription(":x: **| Incorrect usage of command you need to provide an amount of messages to Clear.**\n**Example:** `/purge 50` ")
        .setFooter(".")
        .setColor("RED")
        .setTimestamp()
      let non = new MessageEmbed()
        .setTitle("Purge Command")
        .setDescription(":x: **| Please Put a Valid Number of Messages to Clear!**")
        .setFooter(".")
        .setColor("RED")
        .setTimestamp()
      let msg100 = new MessageEmbed()
        .setTitle("Purge Command")
        .setDescription(":x: **| I can't Clear more than 100 messages.**")
        .setFooter(".")
        .setColor("RED")
        .setTimestamp()
      let msg1 = new MessageEmbed()
        .setTitle("Purge Command")
        .setDescription(":x: **| You cannot Clear less than 1 message.**")
        .setFooter(".")
        .setColor("RED")
        .setTimestamp()
      let perms = new MessageEmbed()
        .setTitle("Purge Command")
        .setDescription(":x: **| You do not have the required permissions to execute this command!**")
        .setFooter(".")
        .setColor("RED")
        .setTimestamp()
      let success = new MessageEmbed()
        .setAuthor(`Purged by ${interaction.member.displayName}`, interaction.member.displayAvatarURL())
        .setTitle("Purge Command")
        .setDescription(`:white_check_mark: **| Succesfully cleared ${clear} messages!**`)
        .setFooter(".")
        .setColor("GREEN")
        .setTimestamp()
 
      if (!clear) return interaction.reply({ embeds: [noi] })
      if (isNaN(clear)) return interaction.reply({ embeds: [non] })
      if (clear > 100) return interaction.reply({ embeds: [msg100] })
      if (clear < 1) return interaction.reply({ embeds: [msg1] })
      if (!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ embeds: [perms] })

	//why does this command exist?
  // for me to learn things :D
  //are you gonna delete the command afterwards?
  // depends on what 4Peace and Big/train say
  //i am sure that train isnt a dev here
  // talking about in the discord ill ask him if we should keep it
      interaction.channel.bulkDelete(clear)
      interaction.reply({ embeds: [success]})
}

module.exports.execute = execute;