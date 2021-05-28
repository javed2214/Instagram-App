import React, { useContext, useState, useEffect } from 'react'
import AuthContext from '../context/AuthContext'
import { db } from './firebase'
import Message from './Message'
import firebase from 'firebase'
import './Home.css'

const MessageDashboard = () => {

    const { getUser, getToUser, toUser, user } = useContext(AuthContext)
    const [msg, setMsg] = useState('')
    const [messages, setMessages] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        getUser()
        getMessages()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if(message.length == 0){
            alert('Message Cannot be Empty')
            return
        }
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
            <div><br />
                <img src={toUser.url} alt="" height="45px" width="45px" style={{ borderRadius: '50%', marginTop: '-5px' }} /> <span style={{ verticalAlign: '20px', marginLeft: '5px', fontFamily: 'KoHo', fontSize: '19px' }}>{toUser.username}</span>
            </div>
            <br />
            <div style={{ height: '450px', overflowY: 'scroll', border: '1px solid black', padding: '6px' }}>
            
                {
                    messages.length > 0 ? messages.map((msg) => {
                        return(
                            <Message key={msg.uid} msg={msg} />
                        )
                    }) : <h5 style={{ fontFamily: 'KoHo' }} className="center">No Chats Available 😅</h5>
                }
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter your Message" value={message} onChange={(e) => setMessage(e.target.value)} />
            </form>
        </div>
    )
}

export default MessageDashboard