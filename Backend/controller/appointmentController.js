import app from "../app.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import { Appointment } from "../model/appointmentSchema.js";
import User from "../model/userSchema.js";



export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, aadharNumber, dob, gender, appointment_date, department, doctor_firstName, doctor_lastName, hasVisited, address} = req.body;
    if (!firstName || !lastName || !email || !phone || !aadharNumber || !dob || !gender || !appointment_date || !department || !doctor_firstName || !doctor_lastName  || !address) {
        return next(new ErrorHandler("Please fill the full form", 400));
    }
    const isConflict=await User.find({
        firstName:doctor_firstName,
        lastName:doctor_lastName,
        role:"Doctor",
        doctorDepartment: department
    })
    if(isConflict.length===0){
        return next(new ErrorHandler("No such doctor found", 400));
    }
    if(isConflict.length>1){
        return next(new ErrorHandler("Multiple doctors found with same name in this department, please contact hospital", 400));
    }
        const doctorId = isConflict[0]._id;
        // Automatically get patientId from authenticated user (if available)
        const patientId = req.user?._id;
        const appointment = await Appointment.create({
            firstName,
            lastName,
            email,
            phone,
            aadharNumber,
            dob,
            gender,
            appointment_date,
            department,
            doctor: {
                firstName: doctor_firstName,
                lastName: doctor_lastName
            },
            hasVisited,
            doctorId,
            patientId,
            address
        });
    res.status(200 ).json({
        success: true,
        message: "Appointment booked successfully",
        appointment
    });

})  

// Get All Appointments Controller
export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments=await Appointment.find();   // Fetch all appointments from the database
    res.status(200).json({
        success: true,
        appointments
    });
});


// Update Appointment Status Controller
export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    console.log('Updating appointment ID:', id);
    console.log('Request body:', req.body);
    
    let appointment= await Appointment.findById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found", 404));
    }
    
    console.log('Current appointment status:', appointment.status);
    
    appointment = await Appointment.findByIdAndUpdate(id, req.body, { 
        new: true,
        runValidators: true,
        useFindAndModify: false  
    });
    
    console.log('Updated appointment status:', appointment.status);
    
    res.status(200).json({
        success: true,
        message: "Appointment status updated successfully",
        appointment
    });
});


// Delete Appointment Controller
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found", 404));
    }
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Appointment deleted successfully"
    });
});
