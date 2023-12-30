import React, { useRef, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, Grid, Toolbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getData, serverURL } from '../../../Services/FetchNodeServices';

export default function MenuComponent(props) {

    const theme = useTheme()
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'))
    const matches_md = useMediaQuery(theme.breakpoints.down('md'))
    const [category, setCategory] = useState([])

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const fetchCategory = async () => {
        var response = await getData('blog/fetch-category')
        setCategory(response.categoryData)
    }

    useEffect(function () {
        fetchCategory()
    }, [])

    const servicesContent = () => {
        const servicesIcons = [
            {
                icon: 'https://startglobal.co/img/users-02.svg',
                title: 'Form U.S. company'
            },
            {
                icon: 'https://startglobal.co/img/icon-invoice.svg',
                title: 'Obtain EIN or ITIN'
            },
            {
                icon: 'https://startglobal.co/img/icon-book.svg',
                title: 'Open Stripe/PayPal'
            },
            {
                icon: 'https://startglobal.co/img/file-check-02.svg',
                title: 'Open Business Bank'
            },
            {
                icon: 'https://startglobal.co/img/calculator.svg',
                title: 'Create Amazon Account'
            },
            {
                icon: 'https://startglobal.co/img/file.svg',
                title: 'Website Development'
            },
            {
                icon: 'https://startglobal.co/img/icon-invoice.svg',
                title: 'Obtain EIN or ITIN'
            },
            {
                icon: 'https://startglobal.co/img/icon-book.svg',
                title: 'Open Stripe/PayPal'
            },
            {
                icon: 'https://startglobal.co/img/file-check-02.svg',
                title: 'Open Business Bank'
            },
            {
                icon: 'https://startglobal.co/img/users-02.svg',
                title: 'Form U.S. company'
            },
            {
                icon: 'https://startglobal.co/img/icon-invoice.svg',
                title: 'Obtain EIN or ITIN'
            },
            {
                icon: 'https://startglobal.co/img/icon-book.svg',
                title: 'Open Stripe/PayPal'
            },
            {
                icon: 'https://startglobal.co/img/file-check-02.svg',
                title: 'Open Business Bank'
            },
            {
                icon: 'https://startglobal.co/img/calculator.svg',
                title: 'Create Amazon Account'
            },
            {
                icon: 'https://startglobal.co/img/file.svg',
                title: 'Website Development'
            },
        ]
        return (
            <div>
                <Grid container spacing={1} style={{ padding: '3% 5%' }}>
                    <CloseIcon onClick={handleClose} fontSize='large' style={{ position: 'absolute', top: '6%', right: '4%', cursor: 'pointer', color: 'gray', zIndex: 2 }} />
                    <Grid item md={4} style={{ padding: '1%' }}>
                        <h3 style={{ fontWeight: 600, fontSize: 18, margin: 0, marginBottom: '1%' }}>START YOUR BUSINESS</h3>
                        {
                            category.slice(0, 3).map((item, i) => {
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '10% 0' }}>
                                        <img src={`${serverURL}/images/${item.poster}`} style={{ marginRight: '3%', height: 70, width: 70, borderRadius: '50%'}} />
                                        <p style={{ fontWeight: 500, color: 'black', fontSize: 19 }}>{item.categoryname}</p>
                                    </div>
                                )
                            })
                        }

                    </Grid>
                    <Grid item md={4} style={{ padding: '1%' }}>
                        <h3 style={{ fontWeight: 600, fontSize: 18, margin: 0, marginBottom: '1%' }}>MANAGE YOUR BUSINESS </h3>
                        {
                            category.slice(3, 6).map((item, i) => {
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '10% 0' }}>
                                        <img src={`${serverURL}/images/${item.poster}`} style={{ marginRight: '3%', height: 70, width: 70, borderRadius: '50%' }} />
                                        <p style={{ fontWeight: 500, color: 'black', fontSize: 19 }}>{item.categoryname}</p>
                                    </div>
                                )
                            })
                        }
                    </Grid>
                    <Grid item md={4} style={{ padding: '1%' }}>
                        <h3 style={{ fontWeight: 600, fontSize: 18, margin: 0, marginBottom: '1%' }}>MANAGE YOUR BUSINESS </h3>
                        {
                            category.slice(6, 9).map((item, i) => {
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '10% 0' }}>
                                        <img src={`${serverURL}/images/${item.poster}`} style={{ marginRight: '3%', height: 70, width: 70, borderRadius: '50%' }} />
                                        <p style={{ fontWeight: 500, color: 'black', fontSize: 19 }}>{item.categoryname}</p>
                                    </div>
                                )
                            })
                        }
                    </Grid>
                </Grid>
            </div>
        )
    }


    const menuItems = [
        {
            title: 'Home'
        },
        {
            title: 'Categories',
            content: servicesContent()
        }
    ]

    const showMenuItems = () => {
        return (
            menuItems.map((item, index) => {
                return (
                    <div>
                        <Button
                            key={index}
                            style={{
                                color: 'black',
                                fontWeight: 500,
                                fontFamily: 'Inter',
                                fontSize: 17,
                                textTransform: 'capitalize',
                                padding: '1% 0',
                            }}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={(event) => handleClick(event, item)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ fontSize: 18, margin: 0 }}>{item.title}</p>
                                {
                                    item.content ? <KeyboardArrowDownIcon /> : <></>
                                }
                            </div>
                        </Button>
                    </div>
                )
            })
        );
    }


    const handleClick = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(item);
    };

    const staticMenuItems = [
        {
            title: 'About',
        },
        {
            title: 'Contact',
        },
        {
            title: 'Authors',
        }
    ]

    const showStaticMenuItems = () => {
        return (
            staticMenuItems.map((item, i) => {
                return (
                    <div>
                        <Button
                            style={{
                                color: 'black',
                                fontWeight: 500,
                                fontFamily: 'Inter',
                                fontSize: 17,
                                textTransform: 'capitalize',
                                padding: '1% 0',
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ fontSize: 18, margin: 0 }}>{item.title}</p>
                            </div>
                        </Button>
                    </div>
                )
            })
        )
    }


    return (
        <div style={{ position: "sticky", top: '11%', zIndex: 999 }} >
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    {matches_md ? <></> :
                        <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none' }}>
                            <Toolbar style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: '7%' }}>
                                {showMenuItems()}
                                {showStaticMenuItems()}

                                <Menu
                                    PaperProps={{
                                        style: {
                                            width: '55%',
                                            boxShadow: 'none',
                                            borderRadius: 15,
                                            // border: '1px solid gray',
                                            background: selectedItem && selectedItem.content ? 'white' : 'transparent',
                                            position: 'relative',
                                            transform: 'translateX(-30%) translateY(2%)',
                                        },
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                                >
                                    {selectedItem ? selectedItem.content : <>:</>}
                                </Menu>
                            </Toolbar>
                        </AppBar>
                    }
                </Grid>
            </Grid>
        </div>
    );
}