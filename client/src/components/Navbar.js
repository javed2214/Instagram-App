import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import Logout from '../components/Logout'
import './Home.css'

const Navbar = () => {

    const { loggedIn } = useContext(AuthContext)

    return(
        <div>
            <div className="navbar-fixed">
                <nav className="#880e4f pink darken-4">
                    <div className="nav-wrapper">
                        { loggedIn === false && <span style={{ marginLeft: '10px', fontFamily: 'Grand Hotel', fontSize: '28px', cursor: 'pointer' }} className="left">Instagram<span style={{ fontFamily: 'Grand Hotel', fontSize: '21px', cursor: 'pointer' }}>&nbsp; 2.0</span></span> }
                        <ul className="right">
                            {   loggedIn === false &&
                                <>  
                                    <li><Link to='/register'>Register</Link></li>
                                    <li><Link to='/login'>Login</Link></li>
                                </>
                            }
                            {
                                loggedIn === true && 
                                <>  
                                    <li><Link to='/'>Home</Link></li>
                                    <li><Link to='/addpost'>Add Post</Link></li>
                                    <li><Link to='/allusers'>Users</Link></li>
                                    <li><Link to='/favourite'>Favourites</Link></li>
                                    <li><Link to='/profile'>Profile </Link></li>
                                    {/* <li><Link to='/myposts'>My Post</Link></li> */}
                                    {/* <li style={{ float: 'right' }}></li> */}
                                </>
                            }
                        </ul>
                        
                    </div>
                </nav>
            </div>
            {loggedIn === true && <span style={{  float: 'right', marginTop: '18px' }}><Logout /></span>}
        </div>
    )
}

export default Navbar