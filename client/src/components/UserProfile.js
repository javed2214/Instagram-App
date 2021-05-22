import React, { useEffect, useState, useContext } from 'react'
import { useLocation } from "react-router-dom";

const UserProfile = () => {

    const [user, setUser] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const location = useLocation();

    useEffect(() => {
        setUser(location.state.user.user)
        setUsername(location.state.user.user.username)
        setEmail(location.state.user.user.email)
    }, [location])

    return(
        <div className="container center">
            <br /><br /><br /><br />
            <img src={user.url} style={{ borderRadius: '50%' }} height='200px' width="200px" alt="Image Faild to Load" /><br /><br />
            <div className="center" style={{ fontSize: '16px' }}>
                <b style={{ fontFamily: 'Roboto Slab' }}>Username :</b> {username} <br />
                <b style={{ fontFamily: 'Roboto Slab' }}>Email ID :</b> {email}
            </div>
        </div>
    )
}

export default UserProfile