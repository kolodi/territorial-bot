const admin = require("firebase-admin");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");

const serviceAccount = require("./secrets/firebase-adminsdk.json");


const stage = process.env.STAGE;
const guild_id = process.env.GUILD_ID;

const collection = `${guild_id}-${stage}`;
const logsCollection = `${guild_id}-${stage}-logs`;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://territorial-bot.firebaseio.com",
    authDomain: "territorial-bot.firebaseapp.com",
});

const db = getFirestore();

const getUserData = async (userId) => {
    const stringId = String(userId);
    const docRef = db.collection(collection).doc(stringId);
    const result = await docRef.get();
    return result.data();
};

const setUserData = async (userId, data) => {
    const stringId = String(userId);
    const docRef = db.collection(collection).doc(stringId);
    const result = await docRef.set(data);
    return result;
};

const coinsLeaderboard = async (limit) => {
    const query = db.collection(collection).orderBy("coins", "desc").limit(limit);
    const result = await query.get();
    const leaderboard = result.docs.map((doc) => {
        const data = doc.data();
        return {
            userId: doc.id,
            coins: data.coins,
        };
    });
    return leaderboard;
};

const getLogs = async (userId, limit) => {
    const query = db
        .collection(logsCollection)
        .where("target_id", "==", userId)
        .orderBy("time", "desc")
        .limit(limit);
    const result = await query.get();
    const logs = result.docs.map((doc) => doc.data());
    return logs;
};

const log = async (data) => {
    const docRef = db.collection(logsCollection).doc();
    const updateData = { ...data, time: Timestamp.now() };
    const result = await docRef.set(updateData);
    return result;
};

module.exports = {
    getUserData,
    setUserData,
    coinsLeaderboard,
    log,
    getLogs,
};
