import { Grid, TextField, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { postData, getData, serverURL } from '../../../Services/FetchNodeServices';
import React, { useRef } from 'react';
import CardMedia from '@mui/material/CardMedia';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';

export default function GridPostList(props) {

    var navigate = useNavigate()
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  
    const sortedPostList = props.post.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    })

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

    const gridPostList = () => {
        return (
            <Grid container spacing={1} style={{ padding: '0 1% 3%', margin: 0, height: '100%', width: '100%' }}>
                {sortedPostList.map((item, index) => {
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
                        <Grid item md={6} className='ui-post-card-grid'>
                            <div key={index} className='ui-post-card' style={{ cursor: 'pointer' }} onClick={() => handlePostClick(item)}>
                                <div className='ui-like-div'><Checkbox {...label} icon={<FavoriteBorder style={{ color: 'rgb(220, 122, 122' }} />}
                                    checkedIcon={<Favorite style={{ color: 'rgb(255, 122, 122' }} />} />
                                </div>
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
                                    {plainText.substring(0, 170)}...
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
        <div className='root' style={{ height: '100%', width: '100%' }}>
            {gridPostList()}
        </div>
    )
}


