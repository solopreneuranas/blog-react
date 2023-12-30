import { Grid, TextField, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import { postData, getData, serverURL } from '../../../Services/FetchNodeServices';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BottomPostsComponent(props) {

    const [getPostList, setPostList] = useState([])
    var navigate = useNavigate()

    const fetchPostList = async () => {
        var response = await getData(`blog/${props.api}/?category=${props.category}`)
        setPostList(response.data)
    }

    useEffect(function () {
        fetchPostList()
    }, [])

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const handlePostClick = (item) => {
        navigate('/post', { state: { post: item } })
        window.scrollTo(0, 0);
    }

    const bottomPostsList = () => {
        return (
            <Grid container spacing={1} style={{ margin: 0, height: '100%', width: '100%' }}>
                {getPostList.map((item, index) => {
                    var date = new Date(item.date)
                    var year = date.getFullYear()
                    var month = date.getMonth() + 1
                    var day = date.getDate()
                    var body = item.body

                    const removeHtmlTags = (input) => {
                        return input.replace(/<[^>]*>/g, '');
                    }
                    const plainText = removeHtmlTags(body)

                    return (
                        <Grid item md={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div key={index} className='ui-post-card' style={{ cursor: 'pointer' }} onClick={() => handlePostClick(item)}>
                                <CardMedia
                                    className='ui-post-img'
                                    component="img"
                                    height="250"
                                    image={`${serverURL}/images/${item.poster}`}
                                    alt={item.title}
                                />
                                <h3 className='ui-post-heading'>{item.title}</h3>
                                <div className='ui-post-meta'>
                                    <span className='highlight'>{`${months[month - 1]} ${day}, ${year}`}</span> in
                                    <span className='highlight'> {item.category} </span> by
                                    <span className='highlight'> {item.authorData[0].name} </span>
                                </div>
                                <Typography className='ui-post-meta-para' >
                                    {/* {parse(body.substring(0, 170))} */}
                                    {plainText.substring(0, 100)}...
                                </Typography>
                            </div>
                        </Grid>
                    )
                })
                }
            </Grid >
        );
    }

    return (
        <div className='root' style={{ height: '100%' }}>
            <Grid container spacing={1} style={{ position: 'relative', padding: '0 10%', marginBottom: '5%' }}>
                <Grid item md={12} style={{ width: '100%' }}>
                    <h3 style={{ margin: 0, fontWeight: 600, fontSize: 30 }}>Related Posts</h3>
                    {bottomPostsList()}
                </Grid>
            </Grid>
        </div>
    )
}


