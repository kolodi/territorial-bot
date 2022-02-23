const { MessageEmbed, CommandInteraction } = require("discord.js");
const { theme } = require("../theme");
const config = require("../config");
const { getTimeInSeconds } = require("../utils");
const { MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandHandlerOptions, CommandHandler } = require("../types");

const devs = [
    "388427005764567053",
    "442724872326479899",
    "492665478687490048",
    "746994669715587182",
];

/**
 *
 * @param {CommandInteraction} interaction
 * @param {CommandHandlerOptions} options
 */
const execute = async (interaction, options) => {
    const days = Math.floor(client.uptime / 86400000);
    const hours = Math.floor(client.uptime / 3600000) % 24;
    const minutes = Math.floor(client.uptime / 60000) % 60;
    const seconds = Math.floor(client.uptime / 1000) % 60;
    console.log(JSON.stringify(client.application, null, 2));
    const btnRow = new MessageActionRow().addComponents(
        new MessageButton().setLabel("Normal Info").setStyle("PRIMARY").setCustomId("info"),
        new MessageButton().setLabel("Bot Uptime").setStyle("PRIMARY").setCustomId("uptime"),
        new MessageButton().setLabel("Bot Ping").setStyle("PRIMARY").setCustomId("ping")
    );
    const ie = new MessageEmbed()
        .setColor(theme.mainColor)
        .setTitle("Botinfo Command")
        .setDescription(`TerraBot's Information`)
        .addField("Bots Developers", devs.map((d) => `<@${d}>`).join(", "))
        .addField("Bots ID", `**${client.id}**`)
        .addField(
            "Created At",
            `<t:${getTimeInSeconds(client.application.createdTimestamp)}:D>`,
            true
        )
        .addField("Language", "**JavaScript** (node v16)")
        .addField("Library", "**discord.js** v13.6.0")
        .setFooter(`v0.2 Alpha. Stage: ${process.env.STAGE}`)
        .setTimestamp();
    const pe = new MessageEmbed()
        .setColor(theme.mainColor)
        .setTitle("Info Command")
        .addField(
            ":desktop: Current Latency",
            `**${Date.now() - interaction.createdTimestamp}**ms`,
            true
        )
        .setFooter(`v0.2 Alpha. Stage: ${process.env.STAGE}`)
        .setTimestamp();
    const ue = new MessageEmbed()
        .setColor(theme.mainColor)
        .setTitle("Info Command")
        .addField(
            ":timer: Uptime",
            `**${days}**d **${hours}**h **${minutes}**m **${seconds}**s`,
            true
        )
        .addField(
            ":notepad_spiral: Commands Used",
            `The total amount of commands used since last restart is **${totalCommandCounter}**`
        )
        .setFooter(`v0.2 Alpha. Stage: ${process.env.STAGE}`)
        .setTimestamp();
    interaction
        .reply({
            content: "This command gives you different information about the bot.",
            embeds: [ie],
            components: [btnRow],
        })
        .then((msg) => {
            const collecter = interaction.channel.createMessageComponentCollector({
                componentType: "BUTTON",
                time: 50000,
            });
            collecter.on("collect", async (i) => {
                if (i.user.id !== interaction.user.id) {
                    i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
                    return;
                }
                if (i.customId === "info") {
                    await i.update({
                        content: "Showing **Normal Info**",
                        embeds: [ie],
                        components: [btnRow],
                    });
                }
                if (i.customId === "uptime") {
                    await i.update({
                        content: "Showing **Uptime Info**",
                        embeds: [ue],
                        components: [btnRow],
                    });
                }
                if (i.customId === "ping") {
                    await i.update({
                        content: "Showing **Ping Info**",
                        embeds: [pe],
                        components: [btnRow],
                    });
                }
            });
            collecter.on("collect", async (collected) => {
                return;
            });
        });
};

/**
 * @type {CommandHandler}
 */
module.exports = {
    slashCMDBuilder: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Shows information about the bot, like ping, uptime, and other info."),
    execute,
    permissionLevel: 0,
};
const permissionMap = {
    5: {
        roleName: "coin master",
        roleId: "654654654654",
    },
	10: {
        roleName: "admin",
        roleId: "654654654654",
    },
};
