import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import AuthContext from '../context/AuthContext'
import { storage } from "./firebase";

function AddPost() {

    const { getUser, user } = useContext(AuthContext)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [file, setFile] = useState(null);
    const [url, setURL] = useState(user.url);

    useEffect(() => {
        getUser()
    }, [])


    const addPost = async (e) => {
        e.preventDefault()
        const post = {
            title, content
        }
        const resp = await axios.post('/private/createpost', post)
        if(resp.data.success){
            NotificationManager.success('Post Added Successfully!', '', 1800);
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
        } else{
            NotificationManager.error(resp.data.error, '', 1800)
        }
    }

    function handleChange(e) {
        setFile(e.target.files[0]);
    }
    
    function handleUpload(e) {
    e.preventDefault();
    }

    return (
        <div className="container center">
            <form>
            <br /><br /><br />
                <NotificationContainer />
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><br /><br />
                <textarea cols="30" rows="10" style={{ height: '320px', padding: '5px' }} placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)}></textarea><br /><br />
                <input type="file" className="btn #009688 teal" onChange={handleChange} /><br /><br />
                <button disabled={!file} onClick={addPost} className="btn waves-effect waves-light red">Add Post</button>
            </form>
            <br />
            <div>
                {/* <form onSubmit={handleUpload}>
                    <input type="file" className="btn" onChange={handleChange} /><br /><br />
                    <button className="btn red" disabled={!file}>Upload</button>
                </form> */}
            </div>
        </div>
    )
}

export default AddPost
