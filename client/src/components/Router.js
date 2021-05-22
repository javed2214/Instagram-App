import React, { useContext } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Navbar from './Navbar'
import Home from './Home'
import Register from './Register'
import Login from './Login'
import AddPost from './AddPost'
import Profile from './Profile'
import MyPost from './MyPost'
import Favourite from './Favourite'
import EditPost from './EditPost'
import UserProfile from './UserProfile'
import AuthContext from '../context/AuthContext'

const Router = () => {

    const { loggedIn } = useContext(AuthContext)

    return(
        <BrowserRouter>
            <Navbar />
            <Switch>
                {   loggedIn === false &&
                    <>
                        <Route path='/register' component={Register}></Route>
                        <Route path='/login' component={Login}></Route>
                    </>
                }
                { loggedIn === true && <Route exact path='/' component={Home} /> }
                { loggedIn === true && <Route exact path='/addpost' component={AddPost} /> }
                { loggedIn === true && <Route exact path='/profile' component={Profile} /> }
                { loggedIn === true && <Route exact path='/myposts' component={MyPost} /> }
                { loggedIn === true && <Route exact path='/favourite' component={Favourite} /> }
                { loggedIn === true && <Route exact path='/editpost' component={EditPost} /> }
                { loggedIn === true && <Route exact path='/userprofile' component={UserProfile} /> }
                { loggedIn === true ? <Redirect to='/' /> : <Redirect to='/login' /> }
                
            </Switch>
        </BrowserRouter>
    )
}

export default Router