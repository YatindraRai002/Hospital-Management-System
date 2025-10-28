import { config } from "dotenv";
import mongoose from "mongoose";
import User from "./model/userSchema.js";

config({ path: "./config/config.env" });

const verifyDoctorsInMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Hospital-Management",
    });
    console.log("✅ Connected to MongoDB!");
    console.log(`📍 Database: ${process.env.MONGO_URI}\n`);

    // Count all doctors
    const doctorCount = await User.countDocuments({ role: "Doctor" });
    console.log(`👨‍⚕️ Total Doctors in MongoDB: ${doctorCount}\n`);

    // Show all doctors with their details
    const allDoctors = await User.find({ role: "Doctor" })
      .select("firstName lastName email doctorDepartment docAvatar")
      .sort({ doctorDepartment: 1, firstName: 1 });

    console.log("📋 All Doctors in MongoDB Database:\n");
    console.log("=" .repeat(80));

    let currentDept = "";
    allDoctors.forEach((doc, index) => {
      if (currentDept !== doc.doctorDepartment) {
        currentDept = doc.doctorDepartment;
        console.log(`\n🏥 ${currentDept}:`);
        console.log("-".repeat(80));
      }
      console.log(`  ${index + 1}. Dr. ${doc.firstName} ${doc.lastName}`);
      console.log(`     📧 Email: ${doc.email}`);
      console.log(`     🖼️  Avatar: ${doc.docAvatar?.url || 'No avatar'}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log(`\n✅ All ${doctorCount} doctors are stored in MongoDB!`);
    console.log("\n💡 Your Dashboard fetches this data from MongoDB using the backend API.");

    mongoose.connection.close();
    console.log("\n✅ Database connection closed.");
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
  }
};

verifyDoctorsInMongoDB();
