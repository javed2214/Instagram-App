import React, { useEffect, useState, useContext } from 'react'
import { useLocation } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import axios from 'axios'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

function UserProfile() {

    const { getUser, user } = useContext(AuthContext)
    const [userProfile, setUserProfile] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [follow, setFollow] = useState('')
    const location = useLocation();

    useEffect(() => {
        setUserProfile(location.state.user.user)
        setUsername(location.state.user.user.username)
        setEmail(location.state.user.user.email)
    }, [location])

    setTimeout(() => {
        if(user.following.includes(userProfile._id)) setFollow('Unfollow')
        else setFollow('Follow')
    },10)

    const fx = async () => {
        if(user.following.includes(userProfile._id)) setFollow('Unfollow')
        else setFollow('Follow')
    }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        getUser()
    }, [follow])

    const handleFollow = async (id) => {
        const resp = await axios.put(`/private/follow/${id}`)
        getUser()
        if(resp.data.success){
            NotificationManager.success(resp.data.message, '', 1200);
        } else{
            NotificationManager.error(resp.data.error, '', 1200);
        }
    }

    const handleUnfollow = async (id) => {
        const resp = await axios.put(`/private/unfollow/${id}`)
        getUser()
        if(resp.data.success){
            NotificationManager.error(resp.data.message, '', 1200);
        } else{
            NotificationManager.error(resp.data.error, '', 1200);
        }
    }

    return(
        <div className="container center">
            <br /><br /><br /><br />
            <NotificationContainer />
            <img src={userProfile.url} style={{ borderRadius: '50%' }} height='200px' width="200px" alt="Image Faild to Load" /><br /><br />
            <div className="center" style={{ fontSize: '16px' }}>
                <b style={{ fontFamily: 'Roboto Slab' }}>Username :</b> {username} <br />
                <b style={{ fontFamily: 'Roboto Slab' }}>Email ID :</b> {email} <br />
            </div> <br />
            <div>
                { user.following.includes(userProfile._id) ? <button onClick={() => handleUnfollow(userProfile._id)} className="btn #29b6f6 red">Unfollow</button> : <button onClick={() => handleFollow(userProfile._id)} className="btn #29b6f6 light-blue lighten-1">Follow</button> }
            </div><br /><br />
            <div>
            {/* { userProfile.following.length }  */}
            { console.log(user) }
            </div>
        </div>
    )
}

export default UserProfile