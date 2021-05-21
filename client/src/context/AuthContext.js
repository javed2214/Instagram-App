import  React, { useState, useEffect } from 'react'
import axios from 'axios'
import { createContext } from 'react'

const AuthContext = createContext()

const AuthContextProvider = (props) => {

    const [loggedIn, setLoggedIn] = useState(undefined)
    const [user, setUser] = useState('')

    const getLoggedIn = async () => {
        const resp = await axios.post('/auth/loggedin')
        setLoggedIn(resp.data)
    }

    const getUser = async () => {
        const resp = await axios.post('/auth/getuser')
        setUser(resp.data.user)
    }

    useEffect(() => {
        getLoggedIn()
        getUser()
    }, [])

    return(
        <AuthContext.Provider value={{ loggedIn, getLoggedIn, getUser, user }}>
            { props.children }
        </AuthContext.Provider>
    )
}
export default AuthContext;
export { AuthContextProvider }