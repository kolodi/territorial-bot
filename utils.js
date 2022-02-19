module.exports.notYetImplemented = async (interaction) => {
    await interaction.reply({ content: "Not yet implemented.", ephemeral: true });
};

module.exports.unknownInteraction = async (interaction) => {
    await interaction.reply({ content: "Unknown interaction", ephemeral: true });
};

module.exports.serverError = async (interaction, msg) => {
    await interaction.reply({ content: msg || "Server error", ephemeral: true });
};


module.exports.sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports.getTimeInSeconds = date => date.getTime() / 1000 | 0;
