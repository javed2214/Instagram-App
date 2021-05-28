import React from 'react'

function Message({msg}) {
    return (
        <div>
            <b>{msg.by}: </b>{msg.message}
        </div>
    )
}

export default Message
