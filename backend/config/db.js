import mongoose from "mongoose";

// export const connectDB = async () => {
//   await mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() =>console.log("DB Connected"));
// };

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI)
    .then((conn) => {
      console.log("✅ DB Connected:", conn.connection.name); // Log DB name
      console.log("✅ DB Host:", conn.connection.host);       // Log host (local/cloud)
    })
    .catch((err) => console.log("❌ DB Connection Error:", err));
};

