const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const run = async () => {
  console.log("Connecting to:", process.env.MONGO_URI); // ← add this
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected!");
  
  const newPassword = "Admin@123";
  const hashed = await bcrypt.hash(newPassword, 10);
  
  const result = await mongoose.connection.collection("users").updateOne(
    { email: "nandanamanoj2020@gmail.com" },
    { $set: { password: hashed } }
  );
  
  console.log("Update result:", result); // ← add this
  mongoose.disconnect();
};

run();