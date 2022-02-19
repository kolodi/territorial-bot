const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const config = require("./config");

//we need a wrapper for this
//like holy hell
//lets add things to the command files that the help command can use
//like name description examples and whatnot
//lmao
const {
  SlashCommandBuilder,
} = require("@discordjs/builders");
const commands = [
  new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload a command.")
    .addStringOption((opt) =>
      opt
        .setName("name")
        .setDescription("The name of command to reload.")
        .setRequired(true)
        .addChoices([...config.commands.map(c => ([c,c]))])
    ),
  new SlashCommandBuilder()
    .setName("info")
    .setDescription("Shows information about the bot, like ping, uptime, and other info."),
  new SlashCommandBuilder()
     .setName("purge")
     .setDescription("Deletes a specified amount of commands.")
     .addIntegerOption((opt) =>
       opt
         .setName("clear")
         .setDescription("Amount of messages you want to clear. (Default: 10)").setRequired(true)
         .setMinValue(10)
         .setMaxValue(100)
     ), 
  new SlashCommandBuilder()
      .setName("whois")
      .setDescription("Shows information about a specified user.")
      .addMentionableOption((opt) =>
        opt.setName("user").setDescription("User you want to get info of.").setRequired(true)
      ), 
  new SlashCommandBuilder()
      .setName("help")
      .setDescription("Shows the list of commands or help on specified command."),
  new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Display user logs.")
    .addMentionableOption((opt) =>
      opt.setName("user").setDescription("User to get logs for.").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows leaderboard.")
    .addBooleanOption((opt) =>
      opt
        .setName("chat")
        .setDescription("Display in chat for everyone to see (default false)")
    )
    .addIntegerOption((opt) =>
      opt
        .setName("limit")
        .setDescription("The number of users to show (default 10)")
        .setMinValue(10)
        .setMaxValue(100)
    ),
  new SlashCommandBuilder().setName("profile").setDescription("Check your profile."),
  new SlashCommandBuilder()
    .setName("coins")
    .setDescription("add/remove/show coins for a user")
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("add coins to a user")
        .addMentionableOption((opt) =>
          opt
            .setName("user")
            .setDescription("The user to add coins to.")
            .setRequired(true)
        )
        .addIntegerOption((opt) =>
          opt
            .setName("amount")
            .setDescription("The amount of coins to add.")
            .setRequired(true)
            .setMinValue(10)
            .setMaxValue(1000)
        )
        .addStringOption((opt) =>
          opt
            .setName("reason")
            .setDescription("Describe the reason for adding coins.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("remove coins from a user")
        .addMentionableOption((opt) =>
          opt
            .setName("user")
            .setDescription("The user to remove coins from.")
            .setRequired(true)
        )
        .addIntegerOption((opt) =>
          opt
            .setName("amount")
            .setDescription("The amount of coins to remove.")
            .setRequired(true)
            .setMinValue(10)
            .setMaxValue(1000)
        )
        .addStringOption((opt) =>
          opt
            .setName("reason")
            .setDescription("Describe the reason for removing coins.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("show")
        .setDescription("show amount of coins for a user")
        .addMentionableOption((opt) =>
          opt.setName("user").setDescription("The target user.").setRequired(true)
        )
    ),
];

// set default permisisons to false for admin only commands
const adminOnlyCommnds = config.admin_commands;
commands.forEach(command => {
  if(adminOnlyCommnds.includes(command.name)) {
    command.setDefaultPermission(false);
  }
});

const commandsJson = commands.map((command) => command.toJSON());

const commandsBody = JSON.stringify(commandsJson);

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
