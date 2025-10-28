import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../main'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import {GiHamburgerMenu} from "react-icons/gi"
import API_BASE_URL from '../config/api'

const Navbar = () => {
    const [show, setShow] = useState(false);
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const { enqueueSnackbar } = useSnackbar();
    const NavigateTo = useNavigate();
    
    const handleLogout = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/v1/user/patient/logout`, { withCredentials: true });
            setIsAuthenticated(false);
            enqueueSnackbar(res.data.message, { variant: 'success' });
        } catch (err) {
            enqueueSnackbar(err.response.data.message, { variant: 'error' });
        }
    }

    const gotoLogin = () => {
        NavigateTo("/login");
    }

    return (
        <nav className='container'>
            <div className="logo">

            </div>
            <div className={show ? "nav-links showMenu" : "nav-links"}>
                <div className="links">
                    <Link to={"/"}>HOME</Link>
                    <Link to={"/appointment"}>APPOINTMENT</Link>
                    <Link to={"/AboutUs"}>ABOUT</Link>
                </div>
                {isAuthenticated ? (
                    <button className='logout-btn nav-button' onClick={handleLogout}><span>LOGOUT</span></button>
                ) : (
                    <button className='login-btn nav-button' onClick={gotoLogin}><span>LOGIN</span></button>
                )}
            </div>
            <div className="hamburger" onClick={() => setShow(!show)}><GiHamburgerMenu/></div>
        </nav>
    )
}

export default Navbar