const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
const { getTimeInSeconds } = require("../utils");

const execute = async (interaction, client) => {
  	const { options, user } = interaction;
  	const target = options.getMentionable("user") || user;
  	const member = await interaction.guild.members.fetch(target.id);
  	const embed = new MessageEmbed()
  		.setColor(theme.mainColor)
  		.setTitle(`${member.displayName}'s Userinfo`)
  		.setDescription(`*Requested by ${user.username}*`)
  		.setThumbnail(target.displayAvatarURL({ dynamic: true }))
  		.addFields([{
  			name: "User Mention",
  			value: `<@${target.id}>`,
  			inline: true
  		}, {
  			name: 'Usertag:',
  			value: `**${target.tag}**`,
  			inline: true
  		}, {
  			name: "UserID:",
  			value: `**${target.id}**`,
  			inline: true
  		}, {
  			name: "Created At:",
  			value: target.createdAt ? `<t:${getTimeInSeconds(target.createdAt)}:D>` : "Unknown",
  			inline: true
  		}, {
  			name: "Joined At:",
  			value: `<t:${getTimeInSeconds(target.joinedAt)}:D>`,
  			inline: true
  		}, {
  			name: "Nickname:",
  			value: `**${member.displayName}**`,
  			inline: true
  		}, {
  			name: `Roles [${member.roles.cache.size}]:`,
  			value: member.roles.cache.map(r => '<@&' + r.id + '>').join(', ')
  		}])
  		.setFooter(`v0.1 Alpha. Stage: ${process.env.STAGE}`)
  		.setTimestamp()
  	await interaction.reply({ content: `Showing ${member.displayName}'s info`, embeds: [embed] })
}

module.exports.execute = execute;