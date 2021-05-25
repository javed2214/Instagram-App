import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from "react-router-dom";
import axios from 'axios'
import Loader from './Loader'
import './Home.css'
import { useHistory } from 'react-router'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import AuthContext from '../context/AuthContext';

function MyPost() {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const location = useLocation();
    const [userProfile, setUserProfile] = useState(location.state.user)
    const history = useHistory()
    const { getUser, user } = useContext(AuthContext)


    const getAllPosts = async () => {
        const resp = await axios.post('/private/getuserpost', { user: userProfile })
        setPosts(resp.data.posts)
        setLoading(false)
    }

    useEffect(() => {
        getAllPosts()
    }, [posts])

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
            NotificationManager.error('Post Removed from your Favourites!', '', 1200);
        } else{
            NotificationManager.error(resp.data.error, '', 1200);
        }
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

    const editPost = (post) => {
        history.push({
            pathname: '/editpost',
            state: { post: post }
        })
    }

    return (
        <div className="container center">
            <NotificationContainer />
            <br /><br /><br />
            { loading ? <center><br /><br /><Loader type='spokes' color= 'red' height= '20%' width= '20%' /></center> : 
                posts.length > 0 ? posts.map((post) => {
                    return(
                        <div key={post._id} className="row">
                            <div className="center">
                                <div className="card" style={{ background: '#FBFBE9' }}>
                                    <span style={{ paddingTop: '8px', float: 'left', marginLeft: '17px', fontWeight: 'bolder', color: 'blue', fontFamily: 'KoHo', cursor: 'pointer', fontSize: '16px' }}>@{post.user.username}</span>
                                    <br /><br />
                                    <img className="center" src={post.url} style={{ padding: '1px' }} height='250px' width="320px" alt="Image Faild to Load" /><br />
                                    <div className="card-title center" style={{ fontWeight: '', fontSize: '20px', paddingTop: '4px', fontFamily: 'KoHo', marginRight: '20px' }}>{post.title}<span style={{ position: 'absolute', right: 5, top: 8 }}>{ post.favourites.includes(user._id) ? <span><i onClick={() => removeFavourite(post._id)} class="material-icons" style={{ cursor: 'pointer', color: 'green' }}>star</i></span> : <span><i onClick={() => addFavourite(post._id)} class="material-icons" style={{ cursor: 'pointer' }}>star_border</i></span> }</span></div>
                                    <div className="center" className="card-content" style={{ fontFamily: 'Titillium Web', fontSize: '14px', marginTop: '-20px', marginBottom: '-9px' }}>
                                        {post.content}
                                    </div>
                                    <div className="card-action">
                                        { post.likes.includes(user._id) ? <><i onClick={() => unlikePost(post._id)} className="material-icons left noselect" style={{ marginLeft: '0px', marginTop: '8px', cursor: 'pointer', color: 'red', outline: 'none' }}>favorite</i><span style={{ float: 'left', marginTop: '9px' }}>{post.likes.length}</span></> : <><i onClick={() => likePost(post._id)} className="material-icons left noselect" style={{ marginLeft: '0px', marginTop: '8px', cursor: 'pointer' }}>favorite_border</i><span style={{ float: 'left', marginTop: '9px', outline: 'none' }}>{post.likes.length}</span></> }
                                        { user.email === post.user.email ? <button onClick={() => deletePost(post._id)} className="waves-effect waves-light btn #ef5350 red lighten-1" style={{ fontSize: '12px', borderRadius: '100px' }}>Delete</button> : <button className="waves-effect waves-light btn #ef5350 red lighten-1 disabled" style={{ fontSize: '12px', borderRadius: '100px' }}>Delete</button> }
                                        { user.email === post.user.email ? <span onClick={() => editPost(post)} style={{ float: 'right', marginTop: '8px', color: 'black', fontWeight: 'bold', marginRight: '0px', cursor: 'pointer' }}><i className="material-icons left">edit</i></span> : <span style={{ float: 'right', marginTop: '8px', color: 'black', fontWeight: 'bold', marginRight: '0px' }}><i style={{ color: 'grey' }} className="material-icons left disabled">edit</i></span>}
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

export default MyPost
