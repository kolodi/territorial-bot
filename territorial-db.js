const admin = require("firebase-admin");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");

const serviceAccount = require("./secrets/firebase-adminsdk.json");

const collection = "territorial";

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

module.exports = {
    getUserData,
    setUserData,
    coinsLeaderboard,
};
