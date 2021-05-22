import React, { useEffect, useContext, useState } from 'react'
import { useLocation } from "react-router-dom";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import AuthContext from '../context/AuthContext'
import { storage } from "./firebase";
import axios from 'axios'

const EditPost = () => {

    const { getUser, user } = useContext(AuthContext)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [id, setId] = useState('')

    const [file, setFile] = useState(null);
    const [url, setURL] = useState(user.url);


    const location = useLocation();

    useEffect(() => {
        console.log(location.state.post)
        setTitle(location.state.post.title)
        setContent(location.state.post.content)
        setId(location.state.post._id)
        console.log(id)
    }, [location])

    const updatePost = async (id) => {
        // e.preventDefault()
        const post = {
            title, content
        }
        // console.log(title, content)
        const resp = await axios.put(`/private/updatepost/${id}`, post)
        if(resp.data.success){
            NotificationManager.success('Post Updated Successfully!', '', 1800);
        } else{
            NotificationManager.error(resp.data.error, '', 1800)
        }
        const uploadTask = storage.ref(`/images/${file.name}`).put(file);
        uploadTask.on("state_changed", console.log, console.error, () => {
            storage
            .ref("images")
            .child(file.name)
            .getDownloadURL()
            .then((url) => {
                setFile(null);
                setURL(url);
                axios.put('/private/uploadimage', { url, id: resp.data.post._id })
            })
        })
        setTitle('')
        setContent('')
    }

    function handleChange(e) {
        setFile(e.target.files[0]);
    }

    return(
        <div className="container center">
            <form>
                <NotificationContainer />
                <input type="text" placeholder="Title" value={ title } onChange={(e) => setTitle(e.target.value)} /><br /><br />
                <textarea cols="30" rows="10" style={{ height: '320px', padding: '5px' }} placeholder="Content" value={ content } onChange={(e) => setContent(e.target.value)}></textarea><br /><br />
                <input type="file" className="btn" onChange={handleChange} /><br /><br />
            </form>
            <button disabled={!file} onClick={() => updatePost(location.state.post._id)} className="btn">Update Post</button>
        </div>
    )
}

export default EditPost;