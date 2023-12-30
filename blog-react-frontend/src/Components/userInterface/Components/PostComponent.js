import { Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { postData, getData, serverURL } from '../../../Services/FetchNodeServices';
import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ShareIcon from '@mui/icons-material/Share';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import PinterestIcon from '@mui/icons-material/Pinterest';
import parse from 'html-react-parser';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 30,
            border: '0.2px solid #eeeee'
        },
    },
    roundedTextFieldSearch: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 30,
            border: 'none',
            color: 'white',
            background: 'rgba(255, 255, 255, 0.20)',
        },
    },
}))

export default function PostComponent(props) {

    var post = props.post
    var navigate = useNavigate()
    const classes = useStyles();

    const [postTags, setPostTags] = useState([])
    const [getDatabaseCategory, setDatabaseCategory] = useState([])

    const actions = [
        { icon: <FacebookOutlinedIcon />, name: 'FaceBook' },
        { icon: <TwitterIcon />, name: 'Twitter' },
        { icon: <LinkedInIcon />, name: 'Linkedin' },
        { icon: <PinterestIcon />, name: 'Pinterest' },
    ];

    const categoryArray = () => {
        return (
            <div className='ui-category-div' style={{ margin: '2% 0' }}>
                <h3 style={{ fontWeight: 600, fontSize: '23px', margin: 0 }}>Categories: </h3>
                {
                    getDatabaseCategory.map((item, i) => {
                        return (
                            <div className="ui-sidebar-category" style={{ padding: '1% 3%', margin: 0, marginRight: '2%', background: 'white', border: '2px solid #0069FF', marginTop: '1%' }}>
                                {item}
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const tagsArrayFunc = () => {
        const subsetOfTags = postTags.slice(0, 13);
        const uniqueTags = [];
        subsetOfTags.forEach((item) => {
            if (!uniqueTags.includes(item)) {
                uniqueTags.push(item);
            }
        });
        return (
            <div className='ui-category-div' style={{ margin: '2% 0' }}>
                <h3 style={{ fontWeight: 600, fontSize: '23px', margin: 0 }}>Tags: </h3>
                {
                    uniqueTags.map((item, i) => {
                        return (
                            <div className="ui-sidebar-category" style={{ padding: '1% 3%', margin: 0, marginRight: '2%', background: 'white', border: '2px solid #0069FF', marginTop: '1%' }}>
                                {item}
                            </div>
                        )
                    })
                }
            </div>
        )
    };

    useEffect(function () {
        setDatabaseCategory(post.category.split(','))
        setPostTags(post.tags.split(','))
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

    const postBreadcrumb = () => {
        return (
            <div className='ui-post-meta' style={{ margin: '1% 0', fontWeight: 400, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', opacity: '60%', fontWeight: 500, cursor: 'pointer' }}>Home <KeyboardArrowRightIcon /> </div>
                <div style={{ display: 'flex', alignItems: 'center', opacity: '60%', fontWeight: 500, cursor: 'pointer' }}> {post.category} <KeyboardArrowRightIcon /></div>
                <div style={{ color: '#0069FF', fontWeight: 500, cursor: 'pointer' }}> {post.title}</div>
            </div>
        )
    }

    const postHero = () => {
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        return (
            <Grid container spacing={1} >
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        borderRadius: 40, width: 1200, height: 650, position: 'cover',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'relative',
                        backgroundImage: `url(${serverURL}/images/${post.poster})`
                    }}>
                        <div style={{ position: 'absolute', background: 'black', width: '100%', height: '100%', opacity: '60%', borderRadius: 40 }}>

                        </div>
                        <h2 className='ui-blog-heading' style={{ fontWeight: 500, color: 'white', opacity: '100%', position: 'absolute', left: '5%', bottom: '10%' }}>{post.title}</h2>

                        <div className='ui-post-meta' style={{ opacity: '80%', color: 'white', fontWeight: 400, position: 'absolute', left: '5%', bottom: '5%' }}>
                            <span>{`${months[month - 1]} ${day}, ${year}`}</span> by
                            <span> {post.authorData[0].name}</span>
                        </div>

                    </div>
                </Grid>

            </Grid>
        )
    }

    const authorDiv = () => {
        return (
            <div style={{ position: 'sticky', top: 20, zIndex: 100 }}>
                <center>
                    <img src={`${serverURL}/images/${post.authorData[0].picture}`} style={{ width: 150, borderRadius: '50%' }} />
                    <h3 style={{ fontWeight: 500, fontSize: 23 }}>{post.authorData[0].name}</h3>
                </center>
            </div>
        )
    }

    const share = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', margin: '3% 0' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '2%', flexWrap: 'wrap', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: 500, margin: 0, opacity: '80%' }}>Share: </h3>
                    <FacebookIcon style={{ color: '#1C1B18', width: 30, height: 30, border: '1px solid gray', borderRadius: '50%', padding: '1%' }} />
                    <TwitterIcon style={{ color: '#1C1B18', width: 30, height: 30, border: '1px solid gray', borderRadius: '50%', padding: '1%' }} />
                    <LinkedInIcon style={{ color: '#1C1B18', width: 30, height: 30, border: '1px solid gray', borderRadius: '50%', padding: '1%' }} />
                </div>
            </div>
        )
    }

    const postContent = () => {
        var date = new Date(post.date)
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        return (
            <Grid container spacing={1} style={{ padding: '2% 10%' }}>
                <Grid item xs={12}>
                    {postBreadcrumb()}
                </Grid>

                <Grid item xs={12}>
                    {postHero()}
                </Grid>

                <Grid item xs={12} style={{ padding: '3% 12%' }}>
                    <Grid container spacing={1}>
                        {/* <Grid item md={3} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>
                                {authorDiv()}
                            </div>
                        </Grid> */}
                        <Grid item md={12}>
                            {categoryArray()}
                            {tagsArrayFunc()}
                            {share()}
                            <div style={{ fontSize: 20, opacity: '90%', textAlign: 'justify' }}>{parse(post.body)}</div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    return (
        <div className='root'>
            <Grid container spacing={0} style={{ position: 'relative' }}>
                {/* <Grid item md={12} style={{ width: '100%' }}>
                    {postHero()}
                </Grid> */}
                <Grid item md={12} style={{ padding: '0 12% 3%' }}>
                    {postContent()}
                </Grid>
                <SpeedDial style={{ position: 'fixed', zIndex: 999, marginTop: '8%', right: 16 }}
                    ariaLabel="SpeedDial basic example"
                    icon={<ShareIcon />}
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                        />
                    ))}
                </SpeedDial>
            </Grid>
        </div>
    )
}


