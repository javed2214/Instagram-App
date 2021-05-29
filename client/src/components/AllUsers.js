import React, { useEffect, useState, useContext } from 'react'
import { useHistory, useLocation } from "react-router";
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import axios from 'axios'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './Home.css'
import Loader from './Loader'

const AllUser = () => {

    const [users, setUsers] = useState([])
    const { getUser, user } = useContext(AuthContext)
    const history = useHistory()
    const [loading, setLoading] = useState(true)

    const getAllUsers = async () => {
        const resp = await axios.post('/private/allusers')
        setUsers(resp.data.users)
        setLoading(false)
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    useEffect(() => {
        getUser()
    }, [])

    const handleFollow = async (id) => {
        const resp = await axios.put(`/private/follow/${id}`)
        getUser()
        getAllUsers()
        if(resp.data.success){
            NotificationManager.success(resp.data.message, '', 1000);
        } else{
            NotificationManager.error(resp.data.error, '', 1000);
        }
    }

    const handleUnfollow = async (id) => {
        const resp = await axios.put(`/private/unfollow/${id}`)
        getUser()
        getAllUsers()
        if(resp.data.success){
            NotificationManager.error(resp.data.message, '', 1000);
        } else{
            NotificationManager.error(resp.data.error, '', 1000);
        }
    }

    const getUserProfile = (data) => {
        history.push({
            pathname: '/profileview',
            state: { user: data }
        })
    }

    return(
        <div className="container center">
            <NotificationContainer />
            <table className="centered">
                <tbody>
                    { loading ? <center><br /><br /><Loader type='spokes' color= 'red' height= '20%' width= '20%' /></center> :  users.map((userProfile) => {
                        return(
                                <tr key={userProfile._id}>
                                <td><span onClick={() => getUserProfile(userProfile)}><img src={userProfile.url} height="70px" width="70px" style={{ borderRadius: '50%', cursor: 'pointer', float: 'left' }} />{ userProfile.isOnline ? <i style={{ position: 'absolute', left: '19%', fontSize: '15px', color: '#58B61C' }} class="material-icons">brightness_1</i> : <i style={{ position: 'absolute', left: '19%', fontSize: '15px', color: '#D0D0B5' }} class="material-icons">brightness_1</i> }&nbsp;&nbsp;&nbsp;&nbsp;<span className="#263238 blue-grey-text text-darken-4" style={{ verticalAlign: '10px', fontSize: '18px', fontWeight: 'bold', fontFamily: 'KoHo', cursor: 'pointer', float: 'left', marginLeft: '12px', marginTop: '20px' }}>{userProfile.username}</span></span></td>
                                {/* <td></td> */}
                                { user.email != userProfile.email ? ( user.following.includes(userProfile._id) ? <td><button onClick={() => handleUnfollow(userProfile._id)} className="btn waves-effect waves-light #c62828  #00695c teal darken-3" style={{ fontSize: '16px', fontFamily: 'Recursive', width: '125px' }}>Following</button></td> : <td><button onClick={() => handleFollow(userProfile._id)} className="btn waves-effect waves-light light-blue lighten-1" style={{ fontSize: '16px', fontFamily: 'Recursive', width: '125px' }}>Follow</button></td> ) : <td><button className="disabled btn waves-effect waves-light #c62828  #00695c teal darken-3" style={{ fontSize: '16px', fontFamily: 'Recursive', width: '125px' }}>Follow</button></td>}
                                </tr>
                        )
                    }) }
                </tbody>
            </table>
        </div>
    )
}

export default AllUser