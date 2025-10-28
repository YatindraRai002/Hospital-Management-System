import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Context } from "../main";
import axios from "axios";
import API_BASE_URL from "../config/api";

const AddNewDoctor = () => {
  const { isAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");

  const navigateTo = useNavigate();

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
    "General Surgery",
    "Physician",
  ];

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!firstName || !lastName || !email || !phone || !aadhar || !dob || !gender || !password || !doctorDepartment) {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
      return;
    }
    
    if (!docAvatar) {
      enqueueSnackbar("Please upload doctor's profile picture", { variant: "error" });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      enqueueSnackbar("Please enter a valid email address", { variant: "error" });
      return;
    }
    
    // Phone validation
    if (phone.length !== 10) {
      enqueueSnackbar("Mobile number must be exactly 10 digits", { variant: "error" });
      return;
    }
    
    // Aadhar validation
    if (aadhar.length !== 12) {
      enqueueSnackbar("Aadhar number must be exactly 12 digits", { variant: "error" });
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("aadharNumber", aadhar);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("doctorDepartment", doctorDepartment);
      formData.append("docAvatar", docAvatar);
      
      console.log("📤 Submitting doctor data...");
      console.log("Doctor details:", { firstName, lastName, email, doctorDepartment });
      
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/doctor/add`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      console.log("✅ Response received:", response.data);
      enqueueSnackbar(response.data.message, { variant: "success" });
      
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setAadhar("");
      setDob("");
      setGender("");
      setPassword("");
      setDoctorDepartment("");
      setDocAvatar("");
      setDocAvatarPreview("");
      
      // Navigate to doctors page after 1 second
      setTimeout(() => {
        navigateTo("/doctors");
      }, 1000);
    } catch (error) {
      console.error("Error adding doctor:", error);
      const errorMessage = error.response?.data?.message || "Failed to add doctor. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  
  return (
    <section className="page">
      <div className="container form-component add-doctor-container">
        <h2 className="form-title">
          <span>👨‍⚕️</span> Register New Doctor
        </h2>
        <form onSubmit={handleAddNewDoctor}>
          <div className="doctor-form-grid">
            {/* Left Column - Avatar Upload */}
            <div className="avatar-section">
              <div className="avatar-preview">
                <img
                  src={docAvatarPreview || "/docHolder.jpg"}
                  alt="Doctor Avatar"
                />
              </div>
              <label htmlFor="avatar-upload" className="avatar-upload-btn">
                📷 Upload Photo
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                style={{ display: "none" }}
              />
              <p className="avatar-hint">JPEG, JPG, PNG or WEBP</p>
            </div>

            {/* Right Column - Form Fields */}
            <div className="form-fields">
              <div className="form-row">
                <div className="input-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength="10"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Aadhar Number *</label>
                  <input
                    type="text"
                    placeholder="12-digit Aadhar"
                    value={aadhar}
                    onChange={(e) => setAadhar(e.target.value)}
                    maxLength="12"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Department *</label>
                  <select
                    value={doctorDepartment}
                    onChange={(e) => setDoctorDepartment(e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {departmentsArray.map((depart, index) => (
                      <option value={depart} key={index}>
                        {depart}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="input-group full-width">
                  <label>Password *</label>
                  <input
                    type="password"
                    placeholder="Create secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength="8"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                ✅ Register Doctor
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddNewDoctor;