import '../App.css';
import * as React from 'react';
import { Grid, Button, TextField } from "@mui/material";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CategoryIcon from '@mui/icons-material/Category';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PanoramaIcon from '@mui/icons-material/Panorama';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import { useState, useEffect } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { makeStyles } from '@material-ui/core/styles';
import PushPinIcon from '@mui/icons-material/PushPin';
import ListIcon from '@mui/icons-material/List';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { Link, MemoryRouter, useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePost from '../Components/CreatePost';
import CategoryList from '../Components/CategoryList';
import CreateCategory from '../Components/CreateCategory';
import GridPostList from '../Components/GridPostList';
import AuthorsList from '../Components/AuthorsList';
import Admin from '../Components/Admin';
import Page from './Page';
import { serverURL } from '../Services/FetchNodeServices';


const useStylesTextField = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 15
        },
    },
}))


export default function Dashboard() {

    var admin = JSON.parse(localStorage.getItem("Admin"))

    var navigate = useNavigate()
    const classes = useStylesTextField();

    const [selectedItemIndex, setSelectedItemIndex] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    }


    useEffect(() => {
        setSelectedItemIndex(0); // 0 is the index of the dashboard item
    }, [])

    const listItems = [
        {
            icon: <DashboardIcon />,
            title: 'Dashboard',
            link: ''
        },
        {
            icon: <PushPinIcon />,
            title: 'Create',
            link: '/dashboard/createpost'
        },
        {
            icon: <ListIcon />,
            title: 'Posts',
            link: '/dashboard/posts'
        },
        {
            icon: <CategoryIcon />,
            title: 'Category',
            link: '/dashboard/category'
        },
        {
            icon: <DescriptionIcon />,
            title: 'Pages',
            link: '/dashboard/pages'
        },
        {
            icon: <PeopleAltIcon />,
            title: 'Authors',
            link: '/dashboard/authors'
        },
        {
            icon: <OpenInNewIcon />,
            title: 'View Blog',
            link: '/'
        }
    ]

    return (
        <div className='root'>
            <div className='box' >
                <Grid container spacing={3} style={{ width: '100%', margin: 0 }}>
                    <Grid item xs={2}
                        style={{
                            background: '#1C2536',
                            padding: '3% 2%',
                            color: 'white',
                            borderRight: '1px solid gainsboro',
                            height: '100vh',
                            position: 'sticky',
                            top: 0
                        }}
                    >

                        <Grid style={{ background: '#3f4757', borderRadius: '10px', display: "flex", justifyContent: "left", alignItems: 'center', padding: '5%' }}>
                            <img src={`${serverURL}/images/${admin[0].picture}`} style={{ width: 50, height: 50, borderRadius: '50%', marginRight: '6%' }} />
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: '500', padding: 0, margin: 0 }}>{admin[0].name}</div>
                                <div style={{ fontSize: '13px', fontWeight: '500', opacity: '70%', padding: 0, margin: 0 }}>{admin[0].email}</div>
                            </div>
                        </Grid>

                        <Grid style={{ marginTop: '20%' }}>
                            <List sx={{ width: '100%', maxWidth: 360 }}
                                component="nav">
                                {listItems.map((item, i) => {

                                    var handleListItem = (i) => {
                                        navigate(item.link)
                                        setSelectedItemIndex(i);
                                    }

                                    return (
                                        <ListItemButton onClick={() => handleListItem(i)}
                                            style={{
                                                margin: '1% 0',
                                                backgroundColor: selectedItemIndex === i ? '#0069ff' : 'transparent',
                                                borderRadius: selectedItemIndex === i ? '4px' : '0',
                                            }}
                                        >
                                            <ListItemIcon style={{ color: 'white', opacity: '75%', fontSize: '15px', opacity: selectedItemIndex === i ? '100%' : '75%', }}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <p style={{ opacity: '75%', fontSize: '15px', opacity: selectedItemIndex === i ? '100%' : '75%', }}>{item.title}</p>
                                        </ListItemButton>
                                    )
                                })}
                            </List>
                        </Grid>
                    </Grid>

                    <Grid item xs={10} style={{ padding: '2% 1% 3%', height: '100%', background: 'white' }}>
                        <Grid container spacing={2} style={{ background: 'white', zIndex: 99 }}>
                            <Grid item md={10}>
                                {/* <TextField variant="outlined" fullWidth className={classes.roundedTextField} label="Search" /> */}
                                <h3 style={{ fontWeight: '600', fontSize: '25px', textAlign: 'left', marginLeft: '3%' }}>Hi, Welcome back {admin[0].name} 👋</h3>
                            </Grid>
                            <Grid item md={2} style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
                                <Badge badgeContent={9} color="success" style={{ marginRight: '8%' }}>
                                    <EmailIcon color="action" style={{ width: 25, height: 25 }} />
                                </Badge>
                                <Badge badgeContent={4} color="error" style={{ marginRight: '8%' }}>
                                    <NotificationsIcon color="action" style={{ width: 25, height: 25 }} />
                                </Badge>
                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 7px rgba(0,0,0,0.25))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={() => navigate('/dashboard/admin')}>
                                        <ListItemIcon>
                                            <PersonIcon />
                                        </ListItemIcon>
                                        My account
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <ListItemIcon>
                                            <PersonAdd fontSize="small" />
                                        </ListItemIcon>
                                        Add another Admin
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <ListItemIcon>
                                            <Settings fontSize="small" />
                                        </ListItemIcon>
                                        Settings
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleClose} style={{ color: '#ff5028' }}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" style={{ color: '#ff5028' }} />
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
                                <img className='profileImg' src={`${serverURL}/images/${admin[0].picture}`} style={{ width: 40, height: 40, borderRadius: '50%' }} onClick={handleClick} />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}
                            style={{
                                height: '100%',
                                width: '100%',
                                marginTop: '3%'
                            }} >
                            <Grid item xs={12} style={{
                                height: '100%', width: '100%'
                            }}>
                                <Routes>
                                    <Route element={<CreatePost />} path="/createpost" />
                                    <Route element={<GridPostList />} path='/posts' />
                                    <Route element={<CreateCategory />} path="/createcategory" />
                                    <Route element={<CategoryList />} path="/category" />
                                    <Route element={<AuthorsList />} path="/authors" />
                                    <Route element={<Admin />} path="/admin" />
                                    <Route element={<Page />} path="/pages" />
                                </Routes>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </div>
        </div>
    )
}