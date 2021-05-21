import React from 'react'
import Cookies from 'js-cookie'
import Router from './components/Router'
import axios from 'axios'
import { AuthContextProvider } from './context/AuthContext'

axios.defaults.withCredentials = true

const App = () => {

    return(
        <AuthContextProvider>
            <Router />
        </AuthContextProvider>
    )
}

export default App;