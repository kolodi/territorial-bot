const notYetImplemented = async (interaction) => {
    await interaction.reply({ content: "Not yet implemented.", ephemeral: true });
};

const unknownInteraction = async (interaction) => {
    await interaction.reply({ content: "Unknown interaction", ephemeral: true });
};

const serverError = async (interaction, msg) => {
    await interaction.reply({ content: msg || "Server error", ephemeral: true });
};

module.exports = {
    notYetImplemented,
    unknownInteraction,
    serverError,
};
