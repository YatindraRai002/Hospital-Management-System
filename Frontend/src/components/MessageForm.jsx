import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import API_BASE_URL from '../config/api';

const MessageForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  
  const handleMessage = async(e) => {
    e.preventDefault();

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!firstName || !lastName || !email || !phone || !message) {
      enqueueSnackbar("Please fill all fields", { variant: 'error' });
      return;
    }

    if (!emailRegex.test(email)) {
      enqueueSnackbar("Please enter a valid email address", { variant: 'error' });
      return;
    }

    if (!phoneRegex.test(phone)) {
      enqueueSnackbar("Phone number must be exactly 10 digits", { variant: 'error' });
      return;
    }

    try{
      await axios.post(`${API_BASE_URL}/api/v1/message/send`,
        {firstName,lastName,email,phone,message},
         {withCredentials:true, headers:{"Content-Type":"application/json"}
        }
      ).then((res) => {
        enqueueSnackbar(res.data.message, { variant: 'success' });
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setMessage("");
      })
    }catch(error){
      enqueueSnackbar(error.response.data.message, { variant: 'error' });
    }
}



  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');



  return (
    <div>
      <div className="container form-component message-form">
        <h2>Send a Message</h2>
        <form onSubmit={handleMessage}>
          <div>
            <input 
              type="text" 
              placeholder='First Name' 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder='Last Name' 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
            />
          </div>
          <div>
            <input 
              type="email" 
              placeholder='Email' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
              type="tel" 
              placeholder='Phone Number' 
              value={phone} 
              onChange={(e) => {
                // Only allow numbers and limit to 10 digits
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhone(value);
              }} 
              maxLength={10}
            />
          </div>
          <textarea rows={7} placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
          <div style={{justifyContent:"center", alignItems:"center", display:"flex"}}>
            <button className='cursor-pointer' type="submit">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MessageForm
