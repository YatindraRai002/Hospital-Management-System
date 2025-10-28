import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaUsers, FaUserMd, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import API_BASE_URL from "../config/api";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/appointment/getall`,
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      console.log('Updating appointment:', appointmentId, 'to status:', status);
      const { data } = await axios.put(
        `${API_BASE_URL}/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      console.log('Update response:', data);
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      enqueueSnackbar(data.message, { variant: "success" });
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message);
      enqueueSnackbar(error.response?.data?.message || "Failed to update status", { variant: "error" });
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner stats">
          <div className="stat-card greeting">
            <div className="g-left">
              <img src="/doc.png" alt="docImg" />
            </div>
            <div className="g-right">
              <p className="muted">Welcome,</p>
              <h4 className="admin-name">{admin && `${admin.firstName} ${admin.lastName}`}</h4>
              <p className="muted small">Manage appointments, doctors and messages from here.</p>
            </div>
          </div>
          <div className="stat-card">
            <p className="muted">Total Appointments</p>
            <h3 className="stat-number">1500</h3>
          </div>
          <div className="stat-card">
            <p className="muted">Registered Doctors</p>
            <h3 className="stat-number">10</h3>
          </div>
        </div>

        <div className="banner appointments">
          <div className="appointments-header">
            <h5>Appointments</h5>
          </div>
          <div className="appointments-table-container">
            <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0
                ? appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{appointment.appointment_date.substring(0, 16)}</td>
                      <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                      <td>{appointment.department}</td>
                      <td>
                        <div className="status-pill">
                          <select
                            className={`status-select ${appointment.status.toLowerCase()}`}
                            value={appointment.status}
                            onChange={(e) =>
                              handleUpdateStatus(appointment._id, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </td>
                      <td className="visited-cell">{appointment.hasVisited === true ? <GoCheckCircleFill className="green"/> : <AiFillCloseCircle className="red"/>}</td>
                    </tr>
                  ))
                : "No Appointments Found!"}
            </tbody>
          </table>

          </div>

        </div>
      </section>
    </>
  );
};

export default Dashboard;