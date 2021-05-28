import React, { useContext, useState, useEffect } from 'react'
import AuthContext from '../context/AuthContext'
import { db } from './firebase'
import Message from './Message'
import firebase from 'firebase'

const MessageDashboard = () => {

    const { getUser, getToUser, toUser, user } = useContext(AuthContext)
    const [msg, setMsg] = useState('')
    const [messages, setMessages] = useState('')
    const [message, setMessage] = useState('')
    const [userid, setUserid] = useState('zzz')

    useEffect(() => {
        getUser()
        getMessages()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        db.collection(user._id > toUser._id ? user._id + toUser._id : toUser._id + user._id).add({
            id: user._id > toUser._id ? user._id + toUser._id : toUser._id + user._id,
            message: message,
            to: toUser.username,
            by: user.username,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setMsg('Message Sent')
        setTimeout(() => {
            setMsg('')
        }, 2000)
        setMessage('')
    }

    const getMessages = () => {
        console.log(userid)
        db.collection(user._id > toUser._id ? user._id + toUser._id : toUser._id + user._id).orderBy('timestamp').onSnapshot(function(querySnapshot){
            setMessages(querySnapshot.docs.map((doc) => ({
                uid: doc.id,
                id: doc.data().id,
                message: doc.data().message,
                to: doc.data().to,
                by: doc.data().by
            })))
        })
    }

    return(
        <div className="container">
            <h4>Messages</h4>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter your Message" value={message} onChange={(e) => setMessage(e.target.value)} />
            </form>
            {msg}
            <br /><br /><br />
            {
                messages.length > 0 ? messages.map((msg) => {
                    return(
                        <Message key={msg.uid} msg={msg} />
                    )
                }) : <h6>No Messages</h6>
            }
        </div>
    )
}

export default MessageDashboard