const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");

const execute = async (interaction, client) => {
  	const { options, user } = interaction;
  	const target = options.getMentionable("user") || user;
  	const member = await interaction.guild.members.fetch(target.id);
  	const embed = new MessageEmbed()
  		.setColor(theme.mainColor)
  		.setTitle(`${target.username}'s Userinfo`)
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
  			value: `<t:${target.createdAt.getTime() / 1000 | 0}:D>`,
  			inline: true
  		}, {
  			name: "Joined At:",
  			value: `**${member.joinedAt}**`,
  			inline: true
  		}, {
  			name: "Nickname:",
  			value: `**${member.displayName}**`,
  			inline: true
  		}, {
  			name: `Roles [${member.roles.cache.size}]:`,
  			value: member.roles.cache.map(r => '<@&' + r.id + '>').join(', ')
  		}])
  		.setFooter('TerraBot | vi.d.k')
  		.setTimestamp()
  	await interaction.reply({ content: `Showing ${target.username}'s info`, embeds: [embed] })
}

module.exports.execute = execute;