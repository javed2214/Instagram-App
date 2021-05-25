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
import ProfileView from './ProfileView'
import AllUser from './AllUsers'
import AuthContext from '../context/AuthContext'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'
import ProfileUpdate from './ProfileUpdate'
import PageNotFound from './PageNotFound'

const Router = () => {

    const { loggedIn } = useContext(AuthContext)

    return(
        <BrowserRouter>
            <Navbar />
            <Switch>
                {   loggedIn === false &&
                    <>  
                        <Route exact path='/' component={Login}></Route>
                        <Route path='/register' component={Register}></Route>
                        <Route path='/login' component={Login}></Route>
                        <Route path='/forgotpassword' component={ForgotPassword}></Route>
                        <Route exact path='/auth/resetpassword/:resetToken' component={ResetPassword} /> 
                    </>
                }

                { loggedIn === false && <Route path="" component={PageNotFound} /> }
               
                { loggedIn === true && <Route exact path='/' component={Home} /> }
                { loggedIn === true && <Route exact path='/addpost' component={AddPost} /> }
                { loggedIn === true && <Route exact path='/profile' component={Profile} /> }
                { loggedIn === true && <Route exact path='/myposts' component={MyPost} /> }
                { loggedIn === true && <Route exact path='/favourite' component={Favourite} /> }
                { loggedIn === true && <Route exact path='/editpost' component={EditPost} /> }
                { loggedIn === true && <Route exact path='/userprofile' component={UserProfile} /> }
                { loggedIn === true && <Route exact path='/profileview' component={ProfileView} /> }
                { loggedIn === true && <Route exact path='/profileupdate' component={ProfileUpdate} /> }
                { loggedIn === true && <Route exact path='/allusers' component={AllUser} /> }
                
                { loggedIn === true && (loggedIn === true ? <Redirect to='/' /> : <Redirect to='/login' />) }
                
            </Switch>
        </BrowserRouter>
    )
}

export default Router