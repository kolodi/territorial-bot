const config = require("./config");
const { Caching } = require("./Caching");

module.exports.notYetImplemented = async (interaction) => {
    await interaction.reply({ content: "Not yet implemented.", ephemeral: config.ephemeral });
};

module.exports.unknownInteraction = async (interaction) => {
    await interaction.reply({ content: "Unknown interaction", ephemeral: config.ephemeral });
};

module.exports.serverError = async (interaction, msg) => {
    await interaction.reply({ content: msg || "Server error", ephemeral: config.ephemeral });
};


/**
 *
 * @param {string} userId
 * @param {*} db
 * @param {Caching} cache
 * @returns {import("./types").UserData} UserData
 */
module.exports.getUserDataCachedOrDB = async (userId, db, cache) => {
    if (typeof userId !== "string") throw TypeError("coins.getUserDataCachedOrDB: 'userID' is not of type 'string'!");
    const cachedUser = cache.getUserCache(userId); // lol
    if (cachedUser && cachedUser.data) {
        console.log(`User ${userId} found in cache. Coins: ${cachedUser.data.coins}`);
        return cachedUser.data;
    }
    /**
     * @type {import("../types").UserData}
     */
    const userData = (await db.getUserData(userId)) || { coins: 0 };
    cache.setUserDataCache(userId, userData);
    return userData;
};

module.exports.sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports.getTimeInSeconds = (date) => {
  const d = new Date(date);
  return d.getTime() / 1000 | 0;
}
