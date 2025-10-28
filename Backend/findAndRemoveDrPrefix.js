import { config } from "dotenv";
import mongoose from "mongoose";
import User from "./model/userSchema.js";

config({ path: "./config/config.env" });

const findAndRemoveDoctorsWithDrPrefix = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Hospital-Management",
    });
    console.log("Connected to database!");

    // Find all doctors with "Dr." in their firstName
    const doctorsWithDrPrefix = await User.find({
      role: "Doctor",
      firstName: /^Dr\./
    });

    console.log(`\nFound ${doctorsWithDrPrefix.length} doctors with "Dr." prefix in their name:\n`);

    for (const doctor of doctorsWithDrPrefix) {
      console.log(`📋 ${doctor.firstName} ${doctor.lastName} (${doctor.email}) - ${doctor.doctorDepartment}`);
    }

    if (doctorsWithDrPrefix.length > 0) {
      console.log(`\n🗑️  Removing ${doctorsWithDrPrefix.length} doctors...\n`);
      
      for (const doctor of doctorsWithDrPrefix) {
        await User.findByIdAndDelete(doctor._id);
        console.log(`✅ Removed: ${doctor.firstName} ${doctor.lastName} (${doctor.email})`);
      }
    }

    // Show remaining doctors count
    const remainingDoctors = await User.find({ role: "Doctor" });
    console.log(`\n📊 Total doctors remaining: ${remainingDoctors.length}`);

    // Show doctors by department
    console.log(`\n📋 Doctors by Department:`);
    const departments = [
      "Cardiology", "Neurology", "Orthopedics", "Pediatrics", 
      "Radiology", "Dermatology", "Physical Therapy", "Oncology", 
      "General Surgery", "Physician"
    ];

    for (const dept of departments) {
      const deptDoctors = await User.find({ 
        role: "Doctor", 
        doctorDepartment: dept 
      }).select("firstName lastName email");
      
      if (deptDoctors.length > 0) {
        console.log(`\n${dept}: ${deptDoctors.length} doctor(s)`);
        deptDoctors.forEach(doc => {
          console.log(`  - ${doc.firstName} ${doc.lastName} (${doc.email})`);
        });
      }
    }

    mongoose.connection.close();
    console.log("\n✅ Database connection closed.");
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
  }
};

findAndRemoveDoctorsWithDrPrefix();
