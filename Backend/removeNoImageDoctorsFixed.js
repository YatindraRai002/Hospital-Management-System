import { config } from "dotenv";
import mongoose from "mongoose";
import User from "./model/userSchema.js";

config({ path: "./config/config.env" });

const removeSpecificDoctorsByName = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Hospital-Management",
    });
    console.log("Connected to database!");

    // Based on the screenshot, remove these 4 doctors that don't have images
    const doctorsToRemove = [
      { firstName: "Smith", lastName: "Johnson", email: "smith.johnson@hospital.com" },
      { firstName: "Emily", lastName: "Davis", email: "emily.davis@hospital.com" },
      // We need to check the other two from your screenshot
    ];

    console.log(`\nChecking all doctors to identify which ones to remove...\n`);

    // Let's list all doctors with their NIC field to identify missing images
    const allDoctors = await User.find({ role: "Doctor" }).select("firstName lastName email doctorDepartment docAvatar");
    
    console.log("All doctors in database:");
    allDoctors.forEach(doc => {
      const hasImage = doc.docAvatar && doc.docAvatar.url;
      console.log(`${hasImage ? '✅' : '❌'} ${doc.firstName} ${doc.lastName} (${doc.email}) - ${doc.doctorDepartment}${!hasImage ? ' - NO IMAGE' : ''}`);
    });

    // Remove doctors without proper images
    console.log(`\n\n🗑️  Removing doctors without images...\n`);
    
    let removedCount = 0;
    for (const doc of allDoctors) {
      const hasImage = doc.docAvatar && doc.docAvatar.url;
      if (!hasImage) {
        await User.findByIdAndDelete(doc._id);
        console.log(`✅ Removed: ${doc.firstName} ${doc.lastName} (${doc.email}) - ${doc.doctorDepartment}`);
        removedCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Removed ${removedCount} doctors without images`);
    
    const remainingDoctors = await User.find({ role: "Doctor" });
    console.log(`📊 Total doctors remaining: ${remainingDoctors.length}`);

    mongoose.connection.close();
    console.log("\n✅ Database connection closed.");
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
  }
};

removeSpecificDoctorsByName();
