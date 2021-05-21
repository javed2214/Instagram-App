import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Loader from './Loader'
import './Home.css'

function MyPost() {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const getAllPosts = async () => {
        const resp = await axios.post('/private/getuserpost')
        setPosts(resp.data.posts)
        setLoading(false)
    }

    useEffect(() => {
        getAllPosts()
    }, [])

    return (
        <div className="container center">
        {/* <h5 style={{ fontFamily: 'Roboto', color:'#0E88C6', marginTop: '16px' }}><b>POSTS</b></h5><br /> */}
        <br /><br /><br />
            { loading ? <center><br /><br /><Loader type='spokes' color= 'red' height= '20%' width= '20%' /></center> : 
                posts.length > 0 ? posts.map((post) => {
                    return(
                        <div key={ post._id } className="row">
                            <div className="center">
                            <div className="card">
                                <img src={post.url} style={{ padding: '1px' }} height='225px' width="320px" alt="Image Faild to Load" />
                                <div className="card-title" style={{ fontWeight: '', fontSize: '22px', paddingTop: '4px', fontFamily: 'Acme' }}>{post.title}</div>
                                <div className="card-content" style={{ fontFamily: 'Roboto', fontSize: '16px' }}>
                                    {post.content}
                                </div>
                                <div className="card-action">
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
