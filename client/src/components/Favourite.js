import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Loader from './Loader'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './Home.css'
import AuthContext from '../context/AuthContext';

function Favourite() {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const { getUser, user } = useContext(AuthContext)

    const getFavouritePosts = async () => {
        const resp = await axios.post('/private/getfavourites')
        setPosts(resp.data.posts)
        setLoading(false)
    }

    const deletePost = async (id) => {
        const resp = await axios.delete(`/private/delete/${id}`)
        if(resp.data.success){
            setPosts(posts.filter((post) => {
                return(
                    post.id !== id
                )
            }))
            NotificationManager.error('Post Deleted Successfully!', '', 1800);
        } else{
            NotificationManager.error(resp.data.error, '', 1800)
        }
    }

    const likePost = async (id) => {
        const resp = await axios.put(`/private/like/${id}`)
        if(resp.data.success){
            NotificationManager.success('Post Liked  :)', '', 1200);
        } else{
            NotificationManager.error(resp.data.error, '', 1200);
        }
    }

    const unlikePost = async (id) => {
        const resp = await axios.put(`/private/unlike/${id}`)
        if(resp.data.success){
            NotificationManager.error('Post UnLiked  :(', '', 1200);
        } else{
            NotificationManager.error(resp.data.error, '', 1200);
        }
    }

    const addFavourite = async (id) => {
        const resp = await axios.put(`/private/addfavourite/${id}`)
        if(resp.data.success){
            NotificationManager.success('Post Added to your Favourites!', '', 1200);
        } else{
            NotificationManager.error(resp.data.error, '', 1200);
        }
    }

    const removeFavourite = async (id) => {
        const resp = await axios.put(`/private/removefavourite/${id}`)
        if(resp.data.success){
            getFavouritePosts()
            NotificationManager.error('Post Removed from your Favourites!', '', 1200);
        } else{
            NotificationManager.error(resp.data.error, '', 1200);
        }
    }

    useEffect(() => {
        getFavouritePosts()
    }, [])

    useEffect(() => {
        getUser()
    }, [])

    return (
        <div className="container center">
        <NotificationContainer />
        {/* <h5 style={{ fontFamily: 'Roboto', color:'#0E88C6', marginTop: '16px' }}><b>POSTS</b></h5><br /> */}
        <br /><br /><br />
            { loading ? <center><br /><br /><Loader type='spokes' color= 'red' height= '20%' width= '20%' /></center> : 
                posts.length > 0 ? posts.map((post) => {
                    return(
                        <div key={post._id} className="row">
                            <div className="center">
                            <div className="card">
                                <span style={{ paddingTop: '8px', float: 'left', marginLeft: '17px', fontWeight: 'bolder', color: 'darkgoldenrod', fontFamily: 'KoHo' }}></span>
                                <br /><br />
                                <img src={post.url} style={{ padding: '1px' }} height='225px' width="320px" alt="Image Faild to Load" />
                                <div className="card-title" style={{ fontWeight: '', fontSize: '22px', paddingTop: '4px', fontFamily: 'Acme', marginRight: '20px' }}>{post.title}<span style={{ position: 'absolute', right: 0, top: 0 }}>{ post.favourites.includes(user._id) ? <span><i onClick={() => removeFavourite(post._id)} class="material-icons" style={{ cursor: 'pointer', color: 'green' }}>star</i></span> : <span><i onClick={() => addFavourite(post._id)} class="material-icons" style={{ cursor: 'pointer' }}>star_border</i></span> }</span></div>
                                <div className="card-content" style={{ fontFamily: 'Roboto', fontSize: '16px' }}>
                                    {post.content}
                                </div>
                                <div className="card-action">
                                    { post.likes.includes(user._id) ? <><i onClick={() => unlikePost(post._id)} className="material-icons left noselect" style={{ marginLeft: '0px', marginTop: '8px', cursor: 'pointer', color: 'red', outline: 'none' }}>favorite</i><span style={{ float: 'left', marginTop: '9px' }}>{post.likes.length}</span></> : <><i onClick={() => likePost(post._id)} className="material-icons left noselect" style={{ marginLeft: '0px', marginTop: '8px', cursor: 'pointer' }}>favorite_border</i><span style={{ float: 'left', marginTop: '9px', outline: 'none' }}>{post.likes.length}</span></> }
                                    { user.email === post.user.email ? <button onClick={() => deletePost(post._id)} className="waves-effect waves-light btn #ef5350 red lighten-1" style={{ fontSize: '12px', borderRadius: '100px' }}>Delete</button> : <button className="waves-effect waves-light btn #ef5350 red lighten-1 disabled" style={{ fontSize: '12px', borderRadius: '100px' }}>Delete</button> }
                                    <Link style={{ float: 'right', marginTop: '8px', color: 'black', fontWeight: 'bold', marginRight: '0px' }} to='/editpost'><i className="material-icons left">edit</i></Link>
                                </div>
                            </div>
                            </div>
                        </div>

                    )
                }) : <h5 style={{ fontFamily: 'Roboto', color:'#0E88C6', marginTop: '50px' }}><b>No Posts to Show :(</b></h5>
            }
        </div>
    )
}

export default Favourite
