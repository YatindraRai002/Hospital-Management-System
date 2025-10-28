import { config } from "dotenv";
import mongoose from "mongoose";
import User from "./model/userSchema.js";

config({ path: "./config/config.env" });

const removeSpecificFourDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Hospital-Management",
    });
    console.log("Connected to database!");

    // Remove these 4 specific doctors based on the screenshot
    const doctorsToRemove = [
      { firstName: "Smith", lastName: "Johnson" },
      { firstName: "Emily", lastName: "Davis" },
      { firstName: "Robert", lastName: "Brown" },
      { firstName: "Lisa", lastName: "Anderson" }
    ];

    console.log(`\nRemoving 4 specific doctors...\n`);

    let removedCount = 0;
    for (const doctorInfo of doctorsToRemove) {
      const doctor = await User.findOne({
        role: "Doctor",
        firstName: doctorInfo.firstName,
        lastName: doctorInfo.lastName
      });
      
      if (doctor) {
        await User.findByIdAndDelete(doctor._id);
        console.log(`✅ Removed: ${doctor.firstName} ${doctor.lastName} (${doctor.email}) - ${doctor.doctorDepartment}`);
        removedCount++;
      } else {
        console.log(`⏭️  Not found: ${doctorInfo.firstName} ${doctorInfo.lastName}`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully removed ${removedCount} doctors`);
    
    const remainingDoctors = await User.find({ role: "Doctor" });
    console.log(`📊 Total doctors remaining: ${remainingDoctors.length}`);

    // Show remaining doctors by department
    console.log(`\n📋 Remaining Doctors by Department:`);
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

removeSpecificFourDoctors();
