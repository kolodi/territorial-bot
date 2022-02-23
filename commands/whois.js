const { MessageEmbed, Interaction } = require("discord.js");
const { theme } = require("../theme");
const { getTimeInSeconds } = require("../utils");
const { CommandHandlerOptions, CommandHandler } = require("../types");

/**
 *
 * @param { Interaction } interaction
 * @param { CommandHandlerOptions } opts
 */
const execute = async (interaction, opts) => {
    const { client } = opts;
    const { options, user } = interaction;
    const target = options.getMentionable("user") || user;
    const member = await interaction.guild.members.fetch(target.id);
    const embed = new MessageEmbed()
        .setColor(theme.mainColor)
        .setTitle(`${member.displayName}'s Userinfo`)
        .setDescription(`*Requested by ${user.username}*`)
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .addFields([
            {
                name: "User Mention",
                value: `<@${target.id}>`,
                inline: true,
            },
            {
                name: "Usertag:",
                value: `**${target.user.tag}**`,
                inline: true,
            },
            {
                name: "UserID:",
                value: `**${target.id}**`,
                inline: true,
            },
            {
                name: "Created At:",
                value: target.createdAt ? `<t:${getTimeInSeconds(target.createdAt)}:D>` : "Unknown",
                inline: true,
            },
            {
                name: "Joined At:",
                value: `<t:${getTimeInSeconds(target.joinedAt)}:D>`,
                inline: true,
            },
            {
                name: "Nickname:",
                value: `**${member.displayName}**`,
                inline: true,
            },
            {
                name: `Roles [${member.roles.cache.size}]:`,
                value: member.roles.cache.map((r) => "<@&" + r.id + ">").join(", "),
            },
        ])
        .setFooter(`v0.2 Alpha. Stage: ${process.env.STAGE}`)
        .setTimestamp();
    await interaction.reply({ content: `Showing ${member.displayName}'s info`, embeds: [embed] });
};

/**
 * @type { CommandHandler }
 */
const handler = {
    execute,
    permissionLevel: 10,
    slashCMDBuilder: new SlashCommandBuilder()
        .setName("whois")
        .setDescription("Shows information about a specified user.")
        .addMentionableOption((opt) =>
            opt .setName("user")
                .setDescription("User you want to get info of.")
                .setRequired(true)
        ),
};

module.exports = handler;
