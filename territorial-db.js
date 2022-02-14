const admin = require("firebase-admin");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");

const serviceAccount = require("./secrets/firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://territorial-bot.firebaseio.com",
    authDomain: "territorial-bot.firebaseapp.com",
});

const db = getFirestore();

// const test = async () => {
//     const docRef = db.collection("territorial").doc("123");
//     const userData = await docRef.get();
//     const data = userData.data();
//     console.log(data);
// };

// test();

module.exports.getUserData = async (userId) => {
    const stringId = String(userId);
    const docRef = db.collection("territorial").doc(stringId);
    const result = await docRef.get();
    return result.data();
};

module.exports.setUserData = async (userId, data) => {
    const stringId = String(userId);
    const docRef = db.collection("territorial").doc(stringId);
    const result = await docRef.set(data);
    return result;
};

module.exports.coinsLeaderboard = async (limit) => {
    const query = db.collection("territorial").orderBy("coins", "desc").limit(limit);
    const result = await query.get();
    const leaderboard = result.docs.map((doc) => {
        const data = doc.data();
        return {
            userId: doc.id,
            coins: data.coins
        };
    });
    return leaderboard;
};
