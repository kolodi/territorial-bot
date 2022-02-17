const admin = require("firebase-admin");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");
const fs= require("fs");

const secrets = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
};

fs.writeFileSync("firebase.json", JSON.stringify(secrets));

const serviceAccount2 = require("./firebase.json");

const stage = process.env.STAGE;
const guild_id = process.env.GUILD_ID;

const collection = `${guild_id}-${stage}`;
const logsCollection = `${guild_id}-${stage}-logs`;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount2),
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
