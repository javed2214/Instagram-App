import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { useHistory } from 'react-router'
import axios from 'axios'

const Logout = () => {
    
    const { getLoggedIn } = useContext(AuthContext)
    const history = useHistory()

    const logOut = async () => {
        await axios.post('/auth/logout')
        await getLoggedIn()
        history.push('/login')
    }
    
    return(
        <>
            <button style={{ marginRight: '15px', marginTop: '-3px', backgroundColor: '#660033' }} className="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={logOut}>Logout</button>
        </>
    )
}

export default Logout