class Caching {
    // here store the user data at runtime
	//can we use $ instead of #, it's for making them private
    #userCache = new Map();
    #leaderboardCache = [];
    #cooldownBetweenCommandsinMiliseconds = 60000;
    constructor(cooldownSeconds = 60) {
        this.#cooldownBetweenCommandsinMiliseconds = cooldownSeconds * 1000;
    }

    get cacheSize() {
      return this.#userCache.size;
    }

    /**
     *
     * @param {string | number} userId
     * @returns
     */
    isUserInCooldown(userId) {
        const id = String(userId);
        const user = this.#userCache.get(id);
        if (user) {
            const now = new Date().getTime();
            const lastCommandCall = user.lastCommandCall;
            const timeDifference = now - lastCommandCall;
            if (timeDifference < this.#cooldownBetweenCommandsinMiliseconds) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @returns {boolean} Is leaderboard table valid
     */
    hasValidLeaderboardCache() {
        return this.#leaderboardCache.length > 0;
    }

    /**
     * Get leaderboard table
     */
    get leaderboard() {
        return this.#leaderboardCache;
    }

    /**
     * Set leaderboard table
     */
    set leaderboard(leaderboard) {
        this.#leaderboardCache = leaderboard;
    }

    /**
     *
     * @param {string | number} userId
     * @returns { import("./types").UserCache }
     */
    getUserCache(userId) {
        const id = String(userId);
        return this.#userCache.get(id);
    }

    /**
     *
     * @param {string | number} userId
     * @param {import("./types").UserData} data
     */
    setUserDataCache(userId, data) {
        const id = String(userId);
        const user = this.#userCache.get(id);
        if (user) {
            user.data = data;
        } else {
            this.#userCache.set(id, {
                userId: id,
                data,
                lastCommandCall: 0,
            });
        }
        this.invalidtateLeaderboardCache();
    }

    /**
     *
     * @param {string | number} userId
     */
    setUserLastCommandCall(userId) {
        const id = String(userId);
        const user = this.#userCache.get(id);
        if (user) {
            user.lastCommandCall = new Date().getTime();
        } else {
            this.#userCache.set(id, {
                userId: id,
                data: null,
                lastCommandCall: new Date().getTime(),
            });
        }
    }

    /**
     * Invalidated stored leaderboard table
     */
    invalidtateLeaderboardCache() {
        this.#leaderboardCache = [];
    }
}
exports.Caching = Caching;
