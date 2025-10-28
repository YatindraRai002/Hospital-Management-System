import { config } from "dotenv";
import mongoose from "mongoose";
import User from "./model/userSchema.js";
import bcrypt from "bcrypt";

config({ path: "./config/config.env" });

const addAllDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Hospital-Management",
    });
    console.log("Connected to database!");

    // All doctors data with department assignments
    const doctors = [
      // Cardiology
      {
        firstName: "Sarah",
        lastName: "Mitchell",
        email: "sarah.mitchell@hospital.com",
        phone: "9876543210",
        aadharNumber: "123456789012",
        dob: "1985-03-15",
        gender: "Female",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Cardiology",
        docAvatar: {
          public_id: "doc1",
          url: "/doc1.jpg"
        }
      },
      {
        firstName: "James",
        lastName: "Anderson",
        email: "james.anderson@hospital.com",
        phone: "9876543211",
        aadharNumber: "123456789013",
        dob: "1980-07-22",
        gender: "Male",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Cardiology",
        docAvatar: {
          public_id: "doc2",
          url: "/doc2.jpg"
        }
      },
      
      // Neurology
      {
        firstName: "Emily",
        lastName: "Davies",
        email: "emily.davies@hospital.com",
        phone: "9876543212",
        aadharNumber: "123456789014",
        dob: "1988-11-30",
        gender: "Female",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Neurology",
        docAvatar: {
          public_id: "doc3",
          url: "/doc3.jpg"
        }
      },
      {
        firstName: "Robert",
        lastName: "Thompson",
        email: "robert.thompson@hospital.com",
        phone: "9876543213",
        aadharNumber: "123456789015",
        dob: "1982-05-18",
        gender: "Male",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Neurology",
        docAvatar: {
          public_id: "doc4",
          url: "/doc4.jpg"
        }
      },
      
      // Orthopedics
      {
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@hospital.com",
        phone: "9876543214",
        aadharNumber: "123456789016",
        dob: "1984-09-12",
        gender: "Male",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Orthopedics",
        docAvatar: {
          public_id: "doc5",
          url: "/doc5.jpg"
        }
      },
      {
        firstName: "Jennifer",
        lastName: "Martinez",
        email: "jennifer.martinez@hospital.com",
        phone: "9876543215",
        aadharNumber: "123456789017",
        dob: "1990-02-28",
        gender: "Female",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Orthopedics",
        docAvatar: {
          public_id: "doc6",
          url: "/doc6.jpg"
        }
      },
      
      // Pediatrics
      {
        firstName: "Amanda",
        lastName: "Rodriguez",
        email: "amanda.rodriguez@hospital.com",
        phone: "9876543216",
        aadharNumber: "123456789018",
        dob: "1987-06-05",
        gender: "Female",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Pediatrics",
        docAvatar: {
          public_id: "doc7",
          url: "/doc7.jpg"
        }
      },
      {
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@hospital.com",
        phone: "9876543217",
        aadharNumber: "123456789019",
        dob: "1983-12-20",
        gender: "Male",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Pediatrics",
        docAvatar: {
          public_id: "doc8",
          url: "/doc8.jpg"
        }
      },
      
      // Radiology
      {
        firstName: "Lisa",
        lastName: "Taylor",
        email: "lisa.taylor@hospital.com",
        phone: "9876543218",
        aadharNumber: "123456789020",
        dob: "1986-04-17",
        gender: "Female",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Radiology",
        docAvatar: {
          public_id: "doc9",
          url: "/doc9.jpg"
        }
      },
      {
        firstName: "Christopher",
        lastName: "Brown",
        email: "christopher.brown@hospital.com",
        phone: "9876543219",
        aadharNumber: "123456789021",
        dob: "1981-08-09",
        gender: "Male",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Radiology",
        docAvatar: {
          public_id: "doc10",
          url: "/doc10.jpg"
        }
      },
      
      // Dermatology
      {
        firstName: "Rachel",
        lastName: "Johnson",
        email: "rachel.johnson@hospital.com",
        phone: "9876543220",
        aadharNumber: "123456789022",
        dob: "1989-01-25",
        gender: "Female",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Dermatology",
        docAvatar: {
          public_id: "doc1",
          url: "/doc1.jpg"
        }
      },
      {
        firstName: "Daniel",
        lastName: "Garcia",
        email: "daniel.garcia@hospital.com",
        phone: "9876543221",
        aadharNumber: "123456789023",
        dob: "1984-10-14",
        gender: "Male",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Dermatology",
        docAvatar: {
          public_id: "doc2",
          url: "/doc2.jpg"
        }
      },
      
      // Physical Therapy
      {
        firstName: "Michelle",
        lastName: "Lee",
        email: "michelle.lee@hospital.com",
        phone: "9876543222",
        aadharNumber: "123456789024",
        dob: "1987-03-08",
        gender: "Female",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Physical Therapy",
        docAvatar: {
          public_id: "doc3",
          url: "/doc3.jpg"
        }
      },
      {
        firstName: "Andrew",
        lastName: "White",
        email: "andrew.white@hospital.com",
        phone: "9876543223",
        aadharNumber: "123456789025",
        dob: "1982-11-19",
        gender: "Male",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Physical Therapy",
        docAvatar: {
          public_id: "doc4",
          url: "/doc4.jpg"
        }
      },
      
      // Oncology
      {
        firstName: "Sophia",
        lastName: "Patel",
        email: "sophia.patel@hospital.com",
        phone: "9876543224",
        aadharNumber: "123456789026",
        dob: "1985-07-03",
        gender: "Female",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Oncology",
        docAvatar: {
          public_id: "doc5",
          url: "/doc5.jpg"
        }
      },
      {
        firstName: "William",
        lastName: "Harris",
        email: "william.harris@hospital.com",
        phone: "9876543225",
        aadharNumber: "123456789027",
        dob: "1983-09-27",
        gender: "Male",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Oncology",
        docAvatar: {
          public_id: "doc6",
          url: "/doc6.jpg"
        }
      },
      
      // General Surgery
      {
        firstName: "Jessica",
        lastName: "Clark",
        email: "jessica.clark@hospital.com",
        phone: "9876543226",
        aadharNumber: "123456789028",
        dob: "1988-05-11",
        gender: "Female",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "General Surgery",
        docAvatar: {
          public_id: "doc7",
          url: "/doc7.jpg"
        }
      },
      {
        firstName: "Matthew",
        lastName: "Lewis",
        email: "matthew.lewis@hospital.com",
        phone: "9876543227",
        aadharNumber: "123456789029",
        dob: "1981-12-06",
        gender: "Male",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "General Surgery",
        docAvatar: {
          public_id: "doc8",
          url: "/doc8.jpg"
        }
      },
      
      // Physician
      {
        firstName: "Laura",
        lastName: "Robinson",
        email: "laura.robinson@hospital.com",
        phone: "9876543228",
        aadharNumber: "123456789030",
        dob: "1986-08-23",
        gender: "Female",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Physician",
        docAvatar: {
          public_id: "doc9",
          url: "/doc9.jpg"
        }
      },
      {
        firstName: "Kevin",
        lastName: "Walker",
        email: "kevin.walker@hospital.com",
        phone: "9876543229",
        aadharNumber: "123456789031",
        dob: "1984-02-16",
        gender: "Male",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Physician",
        docAvatar: {
          public_id: "doc10",
          url: "/doc10.jpg"
        }
      },
      
      // Additional doctors to cover all departments
      {
        firstName: "Nicole",
        lastName: "Hall",
        email: "nicole.hall@hospital.com",
        phone: "9876543230",
        aadharNumber: "123456789032",
        dob: "1989-06-29",
        gender: "Female",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Cardiology",
        docAvatar: {
          public_id: "doc1",
          url: "/doc1.jpg"
        }
      },
      {
        firstName: "Thomas",
        lastName: "Allen",
        email: "thomas.allen@hospital.com",
        phone: "9876543231",
        aadharNumber: "123456789033",
        dob: "1980-04-12",
        gender: "Male",
        password: "doctor123",
        role: "Doctor",
        doctorDepartment: "Neurology",
        docAvatar: {
          public_id: "doc2",
          url: "/doc2.jpg"
        }
      }
    ];

    console.log(`\nAdding ${doctors.length} doctors to the database...\n`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const doctor of doctors) {
      // Check if doctor already exists
      const existingDoctor = await User.findOne({ email: doctor.email });
      
      if (existingDoctor) {
        console.log(`⏭️  Skipped: ${doctor.firstName} ${doctor.lastName} (${doctor.doctorDepartment}) - Already exists`);
        skippedCount++;
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(doctor.password, 10);
      doctor.password = hashedPassword;

      // Create doctor
      await User.create(doctor);
      console.log(`✅ Added: ${doctor.firstName} ${doctor.lastName} (${doctor.doctorDepartment})`);
      addedCount++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully added: ${addedCount} doctors`);
    console.log(`⏭️  Skipped (already exists): ${skippedCount} doctors`);
    console.log(`📝 Total attempted: ${doctors.length} doctors`);

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
      
      console.log(`\n${dept}: ${deptDoctors.length} doctor(s)`);
      deptDoctors.forEach(doc => {
        console.log(`  - Dr. ${doc.firstName} ${doc.lastName} (${doc.email})`);
      });
    }

    mongoose.connection.close();
    console.log("\n✅ Database connection closed.");
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
  }
};

addAllDoctors();
