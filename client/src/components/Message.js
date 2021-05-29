import React, { useContext, useState, useEffect, useRef } from 'react'
import AuthContext from '../context/AuthContext'

function Message({msg}) {

    const { getUser, getToUser, toUser, user } = useContext(AuthContext)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    
    useEffect(() => {
        scrollToBottom()
    }, [])

    useEffect(() => {
        getUser()
    }, [])

    return (
        <>
            {
                toUser.username !== msg.to ? (
                    <div ref={messagesEndRef} style={{ float: 'left', color: 'white', width: '60%', margin: '8px auto', background: 'SlateBlue', borderRadius: '10px', padding: '10px' }}>
                        {msg.message}
                    </div>
                ) : (
                    <div ref={messagesEndRef} style={{ float: 'right', color: 'white', width: '60%', margin: '8px auto', background: '#2a6e49', borderRadius: '10px', padding: '10px' }}>
                        {msg.message}
                    </div>
                )
            }
        </>
    )
}

export default Message
