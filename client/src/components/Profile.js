import axios from 'axios'
import React, { useEffect, useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './Home.css'
import { storage } from "./firebase";
import { Link, Redirect } from 'react-router-dom'

function Profile() {

    const { getUser, user } = useContext(AuthContext)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [uploading, setUploading] = useState('')

    const [file, setFile] = useState(null);
    const [url, setURL] = useState(user.url);
    
    useEffect(() => {
        
    }, [])

    function handleChange(e) {
        setFile(e.target.files[0]);
    }
    
    function handleUpload(e) {
    setUploading('Uploading...')
    e.preventDefault();
    const uploadTask = storage.ref(`/images/${file.name}`).put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
        storage
        .ref("images")
        .child(file.name)
        .getDownloadURL()
        .then((url) => {
            setFile(null);
            setURL(url);
            axios.put('/private/uploadprofile', { url })
            setUploading('Image Uploaded')
            setTimeout(() => {
                setUploading('')
            }, 2000)
        })
    })}

    return (
        <div className="container center">
        <br /><br /><br />
            <NotificationContainer />
    
            <img src={url} style={{ borderRadius: '50%', marginTop: '-10px' }} height='235px' width="235px" alt="Image Faild to Load" /><br /><br />
            <div className="center" style={{ fontSize: '18px' }}>
                <b className="#bf360c deep-orange-text text-darken-4" style={{ fontFamily: 'KoHo', fontSize: '20px' }}>Username : </b> <span style={{ fontFamily: 'Farro' }}>{user.username}</span> <br />
                <b className="#bf360c deep-orange-text text-darken-4" style={{ fontFamily: 'KoHo', fontSize: '20px' }}>Email ID : </b> <span style={{ fontFamily: 'Farro' }}>{user.email}</span><br />
                <b className="#bf360c deep-orange-text text-darken-4" style={{ fontFamily: 'KoHo', fontSize: '20px' }}>Followers : </b> <span style={{ fontFamily: 'Farro' }}>{user.followers.length}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b className="#bf360c deep-orange-text text-darken-4" style={{ fontFamily: 'KoHo', fontSize: '20px'  }}>Following : </b> <span style={{ fontFamily: 'Farro' }}>{user.following.length}</span><br />
            </div>
            <br />
            <div>
                <form onSubmit={handleUpload}>
                    <input type="file" className="btn waves-effect waves-light #009688 teal waves-effect waves-light" onChange={handleChange} /><br /><br />
                    <button className="btn red waves-effect waves-light" disabled={!file}>Upload</button><br /><br />
                    {uploading}
                </form>
            </div>
            <br />
            <div><br />
               <Link to='/profileupdate'><i class="material-icons" style={{ verticalAlign: '-6px', fontSize: '28px' }}>settings</i><span style={{ fontSize: '17px' }}> Settings</span></Link>
            </div>
        </div>
    )
}

export default Profile
