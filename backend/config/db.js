// import mongoose from "mongoose";

// export const connectDB = async () => {
//     mongoose.connect(process.env.MONGODB_CONNECT)
//         .then(() => console.log("✅ DB connected"))
//         .catch((err) => {
//             console.error("❌ DB connection error:", err);
//             process.exit(1);
//         });
// };

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT);
    console.log("DB connected");

    // Drop the unused `username` index if it exists
    const indexes = await mongoose.connection.db.collection("users").indexes();

    const hasUsernameIndex = indexes.some(
      (index) => index.key && index.key.username === 1
    );

    if (hasUsernameIndex) {
      await mongoose.connection.db.collection("users").dropIndex("username_1");
      console.log("Removed obsolete index: username_1");
    }

  } catch (err) {
    console.error(" DB connection error:", err);
    process.exit(1);
  }
};
