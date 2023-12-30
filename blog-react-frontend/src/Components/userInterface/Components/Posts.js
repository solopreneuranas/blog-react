import { Grid, TextField, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { postData, getData, serverURL } from '../../../Services/FetchNodeServices';
import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ShareIcon from '@mui/icons-material/Share';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import PinterestIcon from '@mui/icons-material/Pinterest';
import { useNavigate } from 'react-router-dom';
import GridPostList from './GridPostList';
import Sidebar from './Sidebar';
import BlogHero from './BlogHero';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '15px',
    padding: '3%'
}


export default function Posts(props) {

    const [getPostList, setPostList] = useState([])

    const actions = [
        { icon: <FacebookOutlinedIcon />, name: 'FaceBook' },
        { icon: <TwitterIcon />, name: 'Twitter' },
        { icon: <LinkedInIcon />, name: 'Linkedin' },
        { icon: <PinterestIcon />, name: 'Pinterest' },
    ];

    const fetchPostList = async () => {
        var response = await getData('blog/display-post-list')
        setPostList(response.postListData)
    }

    useEffect(function () {
        fetchPostList()
    }, [])


    const sortedPostList = getPostList.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    })


    return (
        <div className='root' style={{ height: '100%' }}>

            <Grid container spacing={0} style={{ position: 'relative' }}>

                <Grid item md={12} style={{ width: '100%' }}>
                    <BlogHero />
                </Grid>

                <Grid container spacing={0} className='ui-post-grid'>

                    <Grid item md={8} style={{ width: '100%' }}>
                        <GridPostList post={sortedPostList} />
                    </Grid>

                    <Grid item md={4} className='ui-blog-sidebar'>
                        <Sidebar />
                    </Grid>
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


