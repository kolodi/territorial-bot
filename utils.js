const config = require("./config");

module.exports.notYetImplemented = async (interaction) => {
    await interaction.reply({ content: "Not yet implemented.", ephemeral: config.ephemeral });
};

module.exports.unknownInteraction = async (interaction) => {
    await interaction.reply({ content: "Unknown interaction", ephemeral: config.ephemeral });
};

module.exports.serverError = async (interaction, msg) => {
    await interaction.reply({ content: msg || "Server error", ephemeral: config.ephemeral });
};


module.exports.sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports.getTimeInSeconds = (date) => {
  const d = new Date(date);
  return d.getTime() / 1000 | 0;
}
