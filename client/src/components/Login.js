 import React, { useState, useContext } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import AuthContext from '../context/AuthContext';
import Loader from './Loader'
import './Home.css'

function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [hidden, setHidden] = useState(true)
    const { getLoggedIn } = useContext(AuthContext)
    const history = useHistory()

    const loginUser = async (e) => {
        e.preventDefault()
        const user = {
            email, password
        }
        const resp = await axios.post('/auth/login', user)
        if(resp.data.success){
            setLoading(true)
            await getLoggedIn()
            setLoading(false)
            history.push('/')
        } else{
            NotificationManager.error(resp.data.error, '', 1800)
        }
        setEmail('')
        setPassword('')
    }

    const togglePassword = () => {
        setHidden(!hidden)
    }

    return (
        <div className="container center">
            <h4 style={{ fontFamily: 'KoHo' }}><b className='#00695c teal-text text-darken-3'>LOGIN</b></h4><br />
            <NotificationContainer />
            <form onSubmit={loginUser}>
                { loading ? <center><br /><br /><Loader type='spokes' color= 'red' height= '20%' width= '20%' /></center> :  
                    <>
                        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type={hidden ? "password" : "text"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><i onClick={togglePassword} style={{ top: '36.5%', right: '15%', cursor: 'pointer' }} className="material-icons">remove_red_eye</i><br /><br />
                        <button type="submit" className="btn blue waves-effect waves-light">Login</button>
                    </>
                }
            </form>
        </div>
    )
}

export default Login
