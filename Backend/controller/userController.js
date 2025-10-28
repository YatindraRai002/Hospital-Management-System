
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import { ErrorHandler } from '../middlewares/errorMiddleware.js';
import User from '../model/userSchema.js';
import { generateToken } from '../utils/jwtToken.js';
import cloudinary from 'cloudinary';

// Patient Registration Controller
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    console.log('📝 Patient registration attempt:', { 
        email: req.body?.email,
        hasRequiredFields: !!(req.body?.firstName && req.body?.lastName && req.body?.email)
    });

    // Guard: ensure req.body exists and is an object before destructuring
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        console.log('❌ Invalid request body');
        return next(new ErrorHandler('Please fill the full form', 400));
    }
    
    const { firstName, lastName, email, gender, phone, aadharNumber, dob, password } = req.body;
    
    // Validate all required fields
    const missingFields = [];
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!email) missingFields.push('email');
    if (!gender) missingFields.push('gender');
    if (!phone) missingFields.push('phone');
    if (!aadharNumber) missingFields.push('aadharNumber');
    if (!dob) missingFields.push('dob');
    if (!password) missingFields.push('password');

    if (missingFields.length > 0) {
        console.log('❌ Missing fields:', missingFields);
        return next(new ErrorHandler(`Please fill the following fields: ${missingFields.join(', ')}`, 400));
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
        console.log('❌ User already exists:', email);
        return next(new ErrorHandler("User with this email already exists", 409));
    }

    // Create new user
    try {
        user = await User.create({ 
            firstName, 
            lastName, 
            email, 
            gender, 
            phone, 
            aadharNumber, 
            dob, 
            password,
            role: "Patient"
        });
        
        console.log('✅ Patient registered successfully:', {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role
        });

        generateToken(user, "Patient registered successfully", 201, res);
    } catch (error) {
        console.log('❌ Registration error:', error.message);
        return next(new ErrorHandler("Registration failed. Please check your data.", 400));
    }
});


// Login Controller
export const login = catchAsyncErrors(async (req, res, next) => {
    console.log('📝 Login attempt:', { 
        email: req.body.email, 
        role: req.body.role,
        hasPassword: !!req.body.password 
    });
    
    const { email, password, role } = req.body;
    
    // Validate required fields
    if (!email || !password || !role) {
        console.log('❌ Missing required fields');
        return next(new ErrorHandler("Please fill all required fields", 400));
    }

    // Find user with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        console.log('❌ User not found for email:', email);
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    
    console.log('✅ User found:', { 
        email: user.email, 
        role: user.role,
        hasPassword: !!user.password 
    });

    // Validate password
    const isPasswordMatched = await user.isPasswordValid(password);
    console.log('🔐 Password validation result:', isPasswordMatched);
    
    if (!isPasswordMatched) {
        console.log('❌ Password mismatch');
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Validate role
    if (user.role !== role) {
        console.log('❌ Role mismatch:', { userRole: user.role, requestedRole: role });
        return next(new ErrorHandler(`User is registered as ${user.role}, not ${role}`, 403));
    }

    console.log('🎉 Login successful for:', email);
    generateToken(user, "Login successful", 200, res);
});


// Add New Admin Controller
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, gender, phone, aadharNumber, dob, password } = req.body;
    if (!firstName || !lastName || !email || !gender || !phone || !aadharNumber || !dob || !password) {
        return next(new ErrorHandler("Please fill the full form", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} already exists`, 400));
    }
    const admin = await User.create({ firstName, lastName, email, gender, phone, aadharNumber, dob, password, role: "Admin" });
    res.status(200).json({
        success: true,
        message: "Admin added successfully",
        admin
    });

})


// Get All Doctors Controller
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
    const doctors = await User.find({ role: "Doctor" })
    res.status(200).json({
        success: true,
        doctors
    });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user=req.user;
    res.status(200).json({
        success: true,
        user
    });

})


// Logout Admin Controller
export const logoutAdmin=catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("adminToken","",{
        httpOnly:true,
        expires:new Date(Date.now()),
    }).json({
        success: true,
        message: "Logged out successfully",
    });
})


// Logout Patient Controller
export const logoutPatient=catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("patientToken","",{
        httpOnly:true,
        expires:new Date(Date.now()),
    }).json({
        success: true,
        message: "Logged out successfully",
    });
})



export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    console.log('📝 Adding new doctor...');
    console.log('Files received:', req.files);
    console.log('Body received:', req.body);
    
    if(!req.files||Object.keys(req.files).length===0){
        return next(new ErrorHandler("Please upload a profile picture",400));
    }
    const {docAvatar}=req.files; // Get the uploaded file
    const allowedFormats=["image/jpeg","image/jpg","image/png","image/webp"];
    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("Invalid file format. Please upload JPEG, JPG, PNG or WEBP",400));
    }
    const {firstName,lastName,email,gender,phone,aadharNumber,dob,password,doctorDepartment}=req.body;
    if (!firstName || !lastName || !email || !gender || !phone || !aadharNumber || !dob || !password || !doctorDepartment) {
        return next(new ErrorHandler("Please fill the full form",400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} with email ${email} already exists`,400));
    }
    
    console.log('📤 Uploading image to Cloudinary...');
    const cloudinaryResponse=await cloudinary.uploader.upload(docAvatar.tempFilePath);
    
    if(!cloudinaryResponse|| cloudinaryResponse.error){
        console.error('❌ Cloudinary upload error:', cloudinaryResponse.error||'Unknown error');
        return next(new ErrorHandler("Failed to upload image to cloud storage",500));
    }
    
    console.log('✅ Image uploaded successfully');
    console.log('👨‍⚕️ Creating doctor record...');
    
    const doctor=await User.create({ 
        firstName, 
        lastName, 
        email, 
        gender, 
        phone, 
        aadharNumber, 
        dob, 
        password, 
        role: "Doctor", 
        doctorDepartment, 
        docAvatar: {
            public_id: cloudinaryResponse.public_id, 
            url: cloudinaryResponse.secure_url
        } 
    });
    
    console.log('✅ Doctor added successfully:', doctor.email);
    
    res.status(200).json({
        success: true,
        message: "Doctor added successfully",
        doctor
    });
});