import { config } from "dotenv";
import mongoose from "mongoose";
import User from "./model/userSchema.js";

config({ path: "./config/config.env" });

const removeSpecificDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Hospital-Management",
    });
    console.log("Connected to database!");

    // Doctors to remove (the ones with "Dr." prefix in names that have no images)
    const doctorsToRemove = [
      "dr.smith.johnson@hospital.com",
      "dr.emily.davis@hospital.com",
      "dr.robert.brown@hospital.com",
      "dr.lisa.anderson@hospital.com"
    ];

    console.log(`\nRemoving ${doctorsToRemove.length} doctors without images...\n`);

    for (const email of doctorsToRemove) {
      const doctor = await User.findOne({ email: email, role: "Doctor" });
      
      if (doctor) {
        await User.findByIdAndDelete(doctor._id);
        console.log(`✅ Removed: Dr. ${doctor.firstName} ${doctor.lastName} (${doctor.email}) - ${doctor.doctorDepartment}`);
      } else {
        console.log(`⏭️  Not found: ${email}`);
      }
    }

    console.log(`\n✅ Successfully removed doctors without images!`);

    // Show remaining doctors count
    const remainingDoctors = await User.find({ role: "Doctor" }).select("firstName lastName email department");
    console.log(`\n📊 Total doctors remaining: ${remainingDoctors.length}`);

    mongoose.connection.close();
    console.log("\n✅ Database connection closed.");
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
  }
};

removeSpecificDoctors();
