import { config } from "dotenv";
import mongoose from "mongoose";
import User from "./model/userSchema.js";

config({ path: "./config/config.env" });

const removeDuplicateDoctors = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Hospital-Management",
    });
    console.log("Connected to database!");

    // Find all Emily Davies entries
    const emilyDoctors = await User.find({
      firstName: "Emily",
      lastName: "Davies",
      role: "Doctor"
    }).sort({ createdAt: 1 }); // Sort by creation date, oldest first

    console.log(`Found ${emilyDoctors.length} Emily Davies entries`);

    if (emilyDoctors.length > 1) {
      // Keep the first one, remove the rest
      const toKeep = emilyDoctors[0];
      const toRemove = emilyDoctors.slice(1);

      console.log(`\nKeeping: ${toKeep.email} (ID: ${toKeep._id})`);
      console.log(`\nRemoving ${toRemove.length} duplicate(s):`);

      for (const doctor of toRemove) {
        console.log(`- ${doctor.email} (ID: ${doctor._id})`);
        await User.findByIdAndDelete(doctor._id);
      }

      console.log(`\n✅ Successfully removed ${toRemove.length} duplicate Emily Davies entries!`);
    } else if (emilyDoctors.length === 1) {
      console.log("Only one Emily Davies found. No duplicates to remove.");
    } else {
      console.log("No Emily Davies found in the database.");
    }

    // Show remaining doctors
    const remainingDoctors = await User.find({ role: "Doctor" }).select("firstName lastName email department");
    console.log(`\nTotal doctors remaining: ${remainingDoctors.length}`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    mongoose.connection.close();
  }
};

removeDuplicateDoctors();
