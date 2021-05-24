import React, { useState } from 'react'
import './Home.css'
import axios from 'axios'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const resp = await axios.post('/auth/forgotpassword', { email })
        if(resp.data.success){
            setMessage('Email has been sent to this Address. Check your mail to reset the Password. Make sure to check the Spam Folder too.')
            setTimeout(() => {
                setMessage('')
            }, 20000)
        } else{
            NotificationManager.error(resp.data.error, '', 1000);
        }
        setEmail('')
    }

    return(
        <div className="container center">
        <NotificationContainer />
            <br /><br />
            <form onSubmit={handleSubmit}>
                <h6 style={{ fontFamily: 'KoHo', fontSize: '18px' }}>Please Enter your Registered Email ID</h6><br />
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br /><br />
                <button type="submit" className="btn #00695c teal darken-3">Submit</button>
            </form><br />
            <span style={{ color: 'red' }}>{message}</span>
        </div>
    )
}

export default ForgotPassword