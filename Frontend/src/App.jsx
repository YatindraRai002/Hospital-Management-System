import './App.css'
import { SnackbarProvider } from 'notistack';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from './pages/Home'
import Appointment from './pages/Appointment'
import AboutUs from './pages/AboutUs'
import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar';
import { useContext, useEffect } from 'react';
import { Context } from './main';
import axios from 'axios';
import Footer from './components/Footer';
import API_BASE_URL from './config/api';

function App() {
 const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(Context);

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const response= await axios.get(`${API_BASE_URL}/api/v1/user/patient/me`, { withCredentials: true });
      setIsAuthenticated(true);
      setUser(response.data.user);
    } catch (error) {
      // Silently handle authentication errors - user is simply not logged in
      setIsAuthenticated(false);
      setUser({});
    }
  };
  fetchUser();
}, [setIsAuthenticated, setUser]);

  return (
    <>
    <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      autoHideDuration={3000}
    >
      <Router>
        <Navbar/>
        <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/appointment' element={<Appointment/>}/>
         <Route path='/AboutUs' element={<AboutUs/>}/>
         <Route path='/register' element={<Register/>}/>
         <Route path='/login' element={<Login/>}/>
        </Routes>
        <Footer/>
      </Router>
    </SnackbarProvider>
    </>
  )
}

export default App
