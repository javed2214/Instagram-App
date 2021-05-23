import React, { useEffect, useState, useContext } from 'react'
import { useLocation } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import axios from 'axios'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

function ProfileView() {

    const { getUser, user } = useContext(AuthContext)
    const [userProfile, setUserProfile] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [follow, setFollow] = useState('')
    const [followers, setFollowers] = useState('')
    const [following, setFollowing] = useState('')
    const location = useLocation();

    useEffect(() => {
        setUserProfile(location.state.user)
        setUsername(location.state.user.username)
        setEmail(location.state.user.email)
        setFollowers(location.state.user.followers.length)
        setFollowing(location.state.user.following.length)
    }, [location])

    // setTimeout(() => {
    //     if(user.following.includes(userProfile._id)) setFollow('Unfollow')
    //     else setFollow('Follow')
    // },10)

    // const fx = async () => {
    //     if(user.following.includes(userProfile._id)) setFollow('Unfollow')
    //     else setFollow('Follow')
    // }

    useEffect(() => {
        getUser()
    }, [])

    useEffect(() => {
        getUser()
    }, [follow, followers, following])

    const handleFollow = async (id) => {
        const resp = await axios.put(`/private/follow/${id}`)
        setFollowers(resp.data.userProfile.followers.length)
        getUser()
        if(resp.data.success){
            NotificationManager.success(resp.data.message, '', 1000);
        } else{
            NotificationManager.error(resp.data.error, '', 1000);
        }
    }

    const handleUnfollow = async (id) => {
        const resp = await axios.put(`/private/unfollow/${id}`)
        setFollowers(resp.data.userProfile.followers.length)
        getUser()
        if(resp.data.success){
            NotificationManager.error(resp.data.message, '', 1000);
        } else{
            NotificationManager.error(resp.data.error, '', 1000);
        }
    }

    return(
        <div className="container center">
            <br /><br /><br /><br />
            <NotificationContainer />
            <img src={userProfile.url} style={{ borderRadius: '50%', marginTop: '-20px' }} height='270px' width="270px" alt="Image Faild to Load" /><br /><br /><br />
            <div className="center" style={{ fontSize: '18px' }}>
                <b className="#bf360c deep-orange-text text-darken-4" style={{ fontFamily: 'KoHo', fontSize: '20px' }}>Username : </b> <span style={{ fontFamily: 'Farro' }}>{username}</span> <br />
                <b className="#bf360c deep-orange-text text-darken-4" style={{ fontFamily: 'KoHo', fontSize: '20px' }}>Email ID : </b> <span style={{ fontFamily: 'Farro' }}>{email}</span><br />
                <b className="#bf360c deep-orange-text text-darken-4" style={{ fontFamily: 'KoHo', fontSize: '20px' }}>Followers : </b> <span style={{ fontFamily: 'Farro' }}>{followers}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b className="#bf360c deep-orange-text text-darken-4" style={{ fontFamily: 'KoHo', fontSize: '20px'  }}>Following : </b> <span style={{ fontFamily: 'Farro' }}>{following}</span><br />
            </div> <br /><br />
            <div>
                { user.email !== email && (user.following.includes(userProfile._id) ? <button onClick={() => handleUnfollow(userProfile._id)} className="btn #00695c teal darken-3" style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Recursive' }}>Following</button> : <button onClick={() => handleFollow(userProfile._id)} className="btn #29b6f6 light-blue lighten-1" style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Recursive' }}>Follow</button>) }
            </div><br /><br />
            <div>
            </div>
        </div>
    )
}

export default ProfileView