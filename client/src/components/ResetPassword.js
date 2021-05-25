import React, { useState } from 'react'
import './Home.css'
import axios from 'axios'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const ResetPassword = ({ history, match }) => {

    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const resp = await axios.put(`/auth/resetpassword/${match.params.resetToken}`, { newPassword, confirmNewPassword })
        if(resp.data.success){
            setMessage('Your Password got Reset Successfully!')
            setTimeout(() => {
                setMessage('')
                history.push('/login')
            }, 4000)
        } else{
            NotificationManager.error(resp.data.error, '', 1800)
        }
        setNewPassword('')
        setConfirmNewPassword('')
    }

    return(
        <div className="container center">
        <NotificationContainer />
            <h4 style={{ fontFamily: 'KoHo' }}>Reset Password</h4><br />
            <form onSubmit={handleSubmit}>
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <input type="password" placeholder="Confirm New Password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} /><br /><br />
                <button className="btn waves-effect waves-light #00695c teal darken-3" type="submit">Reset Password</button>
            </form> <br />
            <span style={{ color: 'red' }}>{message}</span>
        </div>
    )
}

export default ResetPassword