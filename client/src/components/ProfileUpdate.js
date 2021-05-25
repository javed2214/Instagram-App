import axios from 'axios'
import React, { useEffect, useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './Home.css'


const ProfileUpdate = () => {

    const { getUser, user } = useContext(AuthContext)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        getUser()
    }, [])

    const updateData = async (id) => {
        const user = {
            username, email, password, confirmPassword
        }
        const resp = await axios.put(`/private/updateprofile/${id}`, user)
        if(resp.data.success){
            NotificationManager.success('Profile Updated Successfully', '', 1200);
        } else{
            NotificationManager.error(resp.data.error, '', 1200);
        }
        setUsername('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
    }

    return(
        <div className="container center">
            <NotificationContainer />
            <h5 style={{ fontFamily: 'KoHo', fontWeight: 'bold', fontSize: '25px', float: 'left', marginTop: '20px' }}>Update Profile</h5><br />
            <form><br /><br /><br />
                    <input type="text" placeholder="Username" value={username} onChange={(e) => {setUsername(e.target.value)}} />
                    <input type="text" placeholder="Email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                    <input type="password" placeholder="New Password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                    <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} /><br />
            </form>
            <br />
                <button onClick={() => updateData(user._id)} className="center btn waves-effect waves-light #4a148c purple darken-4">Update</button>
        </div>
    )
}

export default ProfileUpdate