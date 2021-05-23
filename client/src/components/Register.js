import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './Home.css'

function Register() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [hidden, setHidden] = useState(true)

    const history = useHistory()

    const registerUser = async (e) => {
        e.preventDefault()
        const user = {
            username, email, password, confirmPassword
        }
        const resp = await axios.post('/auth/register', user)
        if(resp.data.success){
            history.push('/login')
            NotificationManager.success('User Registered Successfully, Now you can Login', '', 1800);
        } else{
            NotificationManager.error(resp.data.error, '', 1800)
        }
        setUsername('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
    }

    const togglePassword = () => {
        setHidden(!hidden)
    }

    return (
        <div className="container center">
            <h4 style={{ fontFamily: 'KoHo' }}><b className='#00695c teal-text text-darken-3'>REGISTER</b></h4><br />
            <NotificationContainer />
            <form onSubmit={registerUser}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type={hidden ? "password" : "text"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type={hidden ? "password" : "text"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /><i onClick={togglePassword} style={{ top: '36.5%', right: '15%', cursor: 'pointer' }} className="material-icons">remove_red_eye</i><br /><br />
                <button type="submit" className="btn blue waves-effect waves-light">Register</button>
            </form>
        </div>
    )
}

export default Register
