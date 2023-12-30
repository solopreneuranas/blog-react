import { Grid, TextField, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { postData, getData, serverURL } from '../Services/FetchNodeServices';
import React, { useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import ImageIcon from '@mui/icons-material/Image';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import BoltIcon from '@mui/icons-material/Bolt';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useMemo } from "react";
import { makeStyles } from '@material-ui/core/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DialogTitle from '@mui/material/DialogTitle';

import CreatePost from './CreatePost';


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

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))


export default function GridPostList() {

    const classes = useStyles();

    const [getPostList, setPostList] = useState([])
    const [getPostID, setPostID] = useState('')
    const [getFocus, setFocus] = useState(false)
    const [getTitle, setTitle] = useState('')
    const [getBody, setBody] = useState('')
    const [getDate, setDate] = useState(null)
    const [getAuthor, setAuthor] = useState('')
    const [getCategory, setCategory] = useState([])
    const [getPoster, setPoster] = useState({ bytes: '', filename: '' })
    const [getBtnStatus, setBtnStatus] = useState(false)
    const [getOldPoster, setOldPoster] = useState('')
    const [getDeleteBtn, setDeleteBtn] = useState(false)
    const [getSearch, setSearch] = useState('')
    const [getDatabaseCategory, setDatabaseCategory] = useState([])
    const [tagsText, setTagsText] = useState('')
    const [chipData, setChipData] = useState([])
    const [getDatabaseAuthor, setDatabaseAuthor] = useState([])

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value);
    }


    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', "strike"],
                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                { 'indent': '-1' }, { 'indent': '+1' }],
                [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                ['image', "link", "video"],
                ['clean'],
                ['code-block'],
                [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }]
            ],
            imageResize: {
                displaySize: true
            }
        },
    }), [])

    const handleQuill = (newValue) => {
        setBody(newValue)
        if (newValue.trim() !== '') {
            handleError('', 'body');
        }
    }

    const handleSearch = async (event) => {
        setSearch(event.target.value)
        var filteredPosts = getPostList.filter((item) => {
            if (item.title.toLowerCase().includes(getSearch.toLowerCase())) {
                return true
            }
        })
        setPostList(filteredPosts)
    }



    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));


    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip !== chipToDelete))
    };

    const handleTagsInputChange = (event) => {
        setTagsText(event.target.value)
    };

    const handleAddTags = () => {
        if (tagsText.trim() !== '') {
            // Only add a Tags if it's not empty
            const newTag = tagsText
            setChipData([...chipData, newTag])
            setTagsText('')
        }
    }

    const handleTagsInputKeyPress = (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            handleAddTags();
        }
    };


    // Add Category Dialog START //

    const [categoryDialog, setCategoryDialog] = useState(false);

    const handleCategoryDialog = () => {
        setCategoryDialog(true);
    };

    const closeCategoryDialog = () => {
        setCategoryDialog(false)
        setCategoryPoster('')
    }


    const addCatgeoryDialog = () => {

        return (
            <div>
                <Button fullWidth variant="outlined" onClick={handleCategoryDialog}>
                    Add new Category
                </Button>
                <Dialog
                    open={categoryDialog}
                    onClose={closeCategoryDialog}>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {createCategory()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeCategoryDialog}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    // Add Category Dialog END //



    // Add Category START //

    const [getCategoryName, setCategoryName] = useState('')
    const [getCategoryPoster, setCategoryPoster] = useState({ bytes: '', filename: '' })
    const [getErrors, setErrors] = useState('')

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (getCategoryName.length === 0) {
            error = true
            handleError('Please enter category name', 'getCategoryName')
        }
        if (getCategoryPoster.filename.length === 0) {
            error = true
            handleError('Please upload category poster', 'getCategoryPoster')
        }
        return error
    }

    const handleSubmitCategory = async () => {
        var error = validation()
        if (error === false) {
            var formData = new FormData()
            formData.append('categoryname', getCategoryName)
            formData.append('poster', getCategoryPoster.bytes)
            var response = await postData('blog/create-category', formData)
            if (response.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Category added!'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Category not added!'
                })
            }
        }
    }

    const handleCategoryPoster = (event) => {
        setCategoryPoster({ bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) })
    }

    const createCategory = () => {

        return (
            <div className='root'>
                <div className='box'>
                    <Grid container spacing={2}>

                        <Grid item md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button style={{ display: 'flex', justifyContent: 'left' }}
                                onFocus={() => handleError('', 'getCategoryPoster')}
                                error={getErrors.getCategoryPoster}
                                onChange={handleCategoryPoster} component='label'>
                                <input type='file' accept='images/*' hidden />
                                <Avatar src={getCategoryPoster.filename} style={{ width: '80px', height: '80px' }}>
                                    <ImageIcon fontSize='large' />
                                </Avatar>
                            </Button>
                        </Grid>
                        <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: 0 }}>{getErrors.getCategoryPoster}</p>

                        <Grid item md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <TextField
                                error={getErrors.getCategoryName}
                                helperText={getErrors.getCategoryName}
                                onFocus={() => handleError('', 'getCategoryName')} fullWidth label='Category Name'
                                onChange={(event) => setCategoryName(event.target.value)} />
                        </Grid>

                        <Grid item md={12}>
                            <Button onClick={handleSubmitCategory} variant='outlined'>Add Category</Button>
                        </Grid>
                    </Grid>
                </div>

            </div >
        )

    }

    // Add Category END //



    // Constant of Post Edit START //

    const handlePosterUpdate = async () => {

        Swal.fire({
            title: 'Do you want to update the Poster?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Update',
            denyButtonText: `Don't update`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var formData = new FormData()
                formData.append('poster', getPoster.bytes)
                formData.append('_id', getPostID)
                var response = await postData('blog/update-post-poster', formData)
                setBtnStatus(false)
                fetchPostList()
                Swal.fire('Poster Updated!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Poster not updated', '', 'info')
            }
        })
    }

    const handleCancel = () => {
        setBtnStatus(false)
        setPoster({ filename: getOldPoster, bytes: '' })
    }

    const handleDeletePost = async (postID) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0069ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { _id: postID }
                var response = await postData('blog/delete-post', body)
                fetchPostList()
                Swal.fire(
                    'Deleted!',
                    'Post has been deleted.',
                    'success'
                )
            }
        })
    }


    const handlePoster = (event) => {
        setPoster({ bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) })
        setBtnStatus(true)
    }

    const handleDate = (date) => {
        setDate(date)
    }

    const handleBody = (content, editor) => {
        setBody(content)
    }


    const fetchCategory = async () => {
        var response = await getData('blog/fetch-category')
        setDatabaseCategory(response.categoryData)
    }

    const fetchAuthor = async () => {
        var response = await getData('blog/fetch-author')
        setDatabaseAuthor(response.data)
    }

    const fillAuthorList = () => {
        return (
            getDatabaseAuthor.map((item) => {
                return (
                    <MenuItem value={item._id}>{item.name}</MenuItem>
                )
            })
        )
    }

    useEffect(function () {
        fetchCategory()
        fetchAuthor()
    }, [])

    //Const of Post Edit END //



    // Edit Post Dialog START //

    const [open, setOpen] = useState(false);

    const handleClickOpen = (postID, postTitle, postCategory, postBody, postDate, postAuthor, postTags, postPoster) => {
        setOpen(true);
        setBody(postBody)
        setPostID(postID)
        setTitle(postTitle)
        setAuthor(postAuthor)
        setDate(postDate)
        setCategory(postCategory.split(','))
        setChipData(postTags.split(','))
        setPoster({ filename: `${serverURL}/images/${postPoster}`, bytes: '' })
        setOldPoster(`${serverURL}/images/${postPoster}`)
    };


    var tagsString = chipData.join(',');
    var categoryArray = getCategory.map(item => item.categoryname)



    const handleDuplicate = async (postTitle, postBody, postCategory, postDate, postAuthor, postTags, postPoster) => {
        console.log("TAGS>>>", postTags)
        setCategory(postCategory.split(','))
        Swal.fire({
            title: 'Duplicate',
            text: "Are you sure you want to duplicate?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0069ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, duplicate it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    var body = { 'title': postTitle, 'body': postBody, 'date': postDate, 'author': postAuthor }
                    var response = await postData('blog/duplicate-post', body);
                    if (response.status === true) {
                        fetchPostList();
                        Swal.fire('Post duplicated!', '', 'success');
                    } else {
                        alert(response.message)
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire('An error occurred while duplicating the post', '', 'error');
                }
            } else if (result.isDenied) {
                Swal.fire('Post not duplicated', '', 'info');
            }
        });

    };


    const handleClose = () => {
        setOpen(false);
    };

    const editPostDialog = () => {

        return (
            <div>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={handleClose}
                >
                    <AppBar sx={{ position: 'relative', background: '#0069ff' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                {getTitle}
                            </Typography>
                            <Button startIcon={<SaveIcon />} autoFocus variant='outlined' onClick={handleUpdatePost} style={{ borderColor: 'white', color: 'white', marginRight: '0.5%' }}>
                                Update
                            </Button>
                            <Button startIcon={<DeleteIcon />} autoFocus variant='outlined' onClick={() => handleDeletePost(getPostID)} style={{ borderColor: 'white', color: 'white', marginLeft: '0.5%' }}>
                                Delete
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <div style={{ padding: '3% 5%' }}>
                        {editPost()}
                    </div>
                </Dialog>
            </div>
        );
    }

    // Edit Post Dialog END //




    // Edit Post Full Component START //


    // var categoryArray = [{
    //     "categoryname": "Affiliate Marketing"
    // },{
    //     "categoryname": "Blogging"
    // }]
    // console.log(categoryArray)

    console.log(getCategory)
    //console.log(categoryArray)


    const Category = () => {

        return (
            <Stack spacing={3}>

                <Autocomplete
                    className={classes.roundedTextField}
                    multiple
                    options={getDatabaseCategory}
                    getOptionLabel={(category) => category.categoryname}
                    value={getCategory}
                    onChange={(event, newValue) => {
                        setCategory(newValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Categories"
                            placeholder="Category name"
                        />
                    )}
                />

                <Grid container spacing={1}>
                    <Grid item md={12}>
                        {addCatgeoryDialog()}
                    </Grid>
                </Grid>
            </Stack>

        );
    }

    // Category Chip Section END //


    const editPost = () => {

        return (
            <div className='root'>
                <div className='box'>
                    <Grid container spacing={5}>
                        <Grid item md={12}>
                            <TextField
                                className={classes.roundedTextField}
                                value={getTitle}
                                onChange={(event) => setTitle(event.target.value)}
                                variant='outlined' fullWidth label='Add Title'
                            />
                        </Grid>

                        <Grid item md={9}>
                            <ReactQuill theme="snow" value={getBody} onChange={handleQuill} modules={modules} />
                        </Grid>

                        <Grid item md={3}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DemoContainer components={['DatePicker']} >
                                    <DatePicker className={classes.roundedTextField} label="Date" value={dayjs(getDate)} onChange={handleDate} />
                                </DemoContainer>
                            </LocalizationProvider>


                            <FormControl fullWidth style={{ marginTop: '15%' }} className={classes.roundedTextField}>
                                <InputLabel id="demo-simple-select-label">Author</InputLabel>
                                <Select
                                    value={getAuthor}
                                    label="Author"
                                    onChange={handleAuthorChange}>
                                    {fillAuthorList()}
                                </Select>
                            </FormControl>


                            <div style={{ marginTop: '15%' }}>
                                {Category()}
                            </div>
                            <TextField
                                className={classes.roundedTextField}
                                fullWidth
                                label='Tags'
                                variant='outlined'
                                style={{ marginTop: '10%' }}
                                value={tagsText}
                                onChange={handleTagsInputChange}
                                onKeyPress={handleTagsInputKeyPress} // Handle "Enter" key press
                            />
                            <Paper
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                    listStyle: 'none',
                                    p: 0.5,
                                    m: 0,
                                }}
                                component="ul">

                                {chipData.map((item, i) => {
                                    let icon;

                                    if (item === 'React') {
                                        icon = <TagFacesIcon />;
                                    }

                                    return (
                                        <ListItem key={i}>
                                            <Chip
                                                icon={icon}
                                                label={item}
                                                onDelete={item === 'React' ? undefined : handleDelete(item)}
                                            />
                                        </ListItem>
                                    );
                                })}

                            </Paper>

                            <Button
                                onChange={handlePoster}
                                fullWidth component='label'
                                style={{
                                    marginTop: '5%'
                                }}>
                                <input type='file' hidden accept='images/*' />
                                <div style={{ marginTop: '10%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div style={{ position: 'absolute', zIndex: '90', background: 'black', height: '100%', width: '100%', opacity: '35%', borderRadius: '10px' }}></div>
                                    <CameraAltIcon style={{ position: 'absolute', zIndex: '99', color: 'white', height: '50px', width: '50px' }} />
                                    <img src={getPoster.filename} style={{ width: '100%', borderRadius: '10px' }} />
                                </div>
                            </Button>

                            {getBtnStatus ? <Grid container spacing={0} className='left' style={{ marginTop: '5%' }}>
                                <Button startIcon={<SaveIcon />} variant='outlined' onClick={handlePosterUpdate} style={{ marginRight: '2%', borderColor: '#0069ff', color: '#0069ff' }}>
                                    Save
                                </Button>
                                <Button startIcon={<CancelIcon />} variant='outlined' onClick={handleCancel} style={{ marginLeft: '2%', borderColor: 'red', color: 'red' }}>
                                    Cancel
                                </Button>
                            </Grid>
                                : <></>}
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }


    // Edit Post Full Component END //


    const fetchPostList = async () => {
        var response = await getData('blog/display-post-list')
        setPostList(response.postListData)
    }

    useEffect(function () {
        fetchPostList()
    }, [])



    const handleUpdatePost = () => {
        Swal.fire({
            title: 'Do you want to update the post?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Update',
            denyButtonText: `Don't update`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': getPostID, 'title': getTitle, 'body': getBody, 'date': getDate, 'author': getAuthor, 'tags': tagsString }
                var response = await postData('blog/update-post-data', body)
                fetchPostList()
                Swal.fire('Post Updated!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Post not updated', '', 'info')
            }
        })
    }


    const [createPostDialog, setCreatePostDialog] = useState(false)

    const handleCreatePostDialog = () => {
        setCreatePostDialog(true);
    };

    const closeCreatePostDialog = () => {
        setCreatePostDialog(false)
    }

    const newPostDialog = () => {

        return (
            <div>
                <Dialog
                    fullScreen
                    open={createPostDialog}
                >
                    <AppBar sx={{ position: 'relative', background: '#0069ff' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={closeCreatePostDialog}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                New Post
                            </Typography>
                            {/* <Button autoFocus color="inherit" onClick={handleUpdatePost}>
                                Cancel
                            </Button> */}
                        </Toolbar>
                    </AppBar>
                    <div>
                        <CreatePost />
                    </div>
                </Dialog>
            </div>
        );
    }



    // Quick Edit Dialog START //

    const quickEditCategory = () => {

        return (
            <Stack spacing={3}>
                <Autocomplete
                    multiple
                    options={getDatabaseCategory}
                    getOptionLabel={(category) => category.categoryname}
                    value={getCategory}
                    onChange={(event, newValue) => {
                        setCategory(newValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Categories"
                            placeholder="Category name"
                        />
                    )}
                />
            </Stack>

        );
    }

    const [getQuickEdit, setQuickEdit] = useState(false);

    const handleQuickEditOpen = (postID, postTitle, postCategory, postBody, postDate, postAuthor, postTags, postPoster) => {
        setQuickEdit(true)
        setBody(postBody)
        setPostID(postID)
        setTitle(postTitle)
        setAuthor(postAuthor)
        setDate(postDate)
        setCategory(postCategory.split(','))
        setChipData(postTags.split(','))
        setPoster({ filename: `${serverURL}/images/${postPoster}`, bytes: '' })

        setOldPoster(`${serverURL}/images/${postPoster}`)
    };

    const handleQuickEditClose = () => {
        setQuickEdit(false);
    };

    const quickEditDialog = () => {

        return (
            <div>
                <Modal
                    open={getQuickEdit}
                    onClose={handleQuickEditClose}>
                    <Box sx={style}>
                        <Typography variant="h6" component="h2" style={{ color: '#0069ff', marginBottom: '3%' }}>
                            Quick Edit
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item md={12}>
                                <TextField fullWidth value={getTitle} onChange={(event) => setTitle(event.target.value)} label='Title' />
                            </Grid>

                            <Grid item md={6}>
                                <FormControl fullWidth >
                                    <InputLabel id="demo-simple-select-label">Author</InputLabel>
                                    <Select
                                        value={getAuthor}
                                        label="Author"
                                        onChange={handleAuthorChange}>
                                        {fillAuthorList()}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item md={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker label="Date" value={dayjs(getDate)} onChange={handleDate} />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>

                            <Grid item md={6}>
                                <TextField
                                    fullWidth
                                    label='Tags'
                                    value={tagsText}
                                    onChange={handleTagsInputChange}
                                    onKeyPress={handleTagsInputKeyPress}
                                />
                                <Paper
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        flexWrap: 'wrap',
                                        listStyle: 'none',
                                        p: 0.5,
                                        m: 0,
                                    }}
                                    component="ul">
                                    {chipData.map((item, i) => {
                                        let icon;

                                        if (item === 'React') {
                                            icon = <TagFacesIcon />;
                                        }

                                        return (
                                            <ListItem key={i}>
                                                <Chip
                                                    icon={icon}
                                                    label={item}
                                                    onDelete={item === 'React' ? undefined : handleDelete(item)}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </Paper>
                            </Grid>

                            <Grid item md={6}>
                                {quickEditCategory()}
                            </Grid>

                        </Grid>
                        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginTop: '3%' }}>
                            <Grid item md={5} style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                                <Button startIcon={<SaveIcon />} onClick={handleUpdatePost} variant='outlined' style={{ marginRight: '2%', borderColor: '#0069ff', color: '#0069ff' }}>Update</Button>
                                <Button startIcon={<CancelIcon />} onClick={handleQuickEditClose} variant='outlined' style={{ marginLeft: '2%', borderColor: 'red', color: 'red' }}>Close</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </div>
        )
    }

    // Quick Eidt Dialog END //

    const sortedPostList = getPostList.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    })
    const gridPostList = () => {
        return (
            <Grid container spacing={3} style={{ padding: '0 1% 3%', margin: 0, height: '100%' }}>
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
                        <Grid item md={3}>
                            <Card key={index} className='post-card'>
                                <CardHeader
                                    avatar={
                                        <Avatar src={`${serverURL}/images/${item.authorData[0].picture}`} />
                                    }
                                    // action={
                                    //     <IconButton aria-label="settings">
                                    //         <GridMoreVertIcon />
                                    //     </IconButton>
                                    // }
                                    title={item.title}
                                    subheader={`${year}/${month}/${day}`}
                                //subheader={item.category}
                                />
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={`${serverURL}/images/${item.poster}`}
                                    alt={item.title}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.primary">
                                        {plainText.substring(0, 170)}...
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton>
                                        <EditIcon onClick={() => handleClickOpen(item._id, item.title, item.category, item.body, item.date, item.author, item.tags, item.poster)} />
                                    </IconButton>
                                    <IconButton>
                                        <BoltIcon style={{ color: '#569cff' }} onClick={() => handleQuickEditOpen(item._id, item.title, item.category, item.body, item.date, item.author, item.tags, item.poster)} />
                                    </IconButton>
                                    <IconButton>
                                        <ContentCopyIcon style={{ color: '#569cff' }} onClick={() => handleDuplicate(item.title, item.body, item.category, item.date, item.author, item.tags, item.poster)} />
                                    </IconButton>
                                    <IconButton>
                                        <DeleteIcon onClick={() => handleDeletePost(item._id)} style={{ color: 'rgb(255, 110, 110)' }} />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        );
    }

    return (
        <div className='root' style={{ height: '100%' }}>
            <Grid container spacing={0}>
                {/* <Grid item md={1} style={{ marginBottom: '2%' }}>
                        <Button fullWidth variant="outlined" onClick={handleCreatePostDialog}>
                            Add Post
                        </Button>
                    </Grid> */}
                {/* <Grid item md={6} style={{ marginLeft: '3%' }}>
                    <TextField className={classes.roundedTextField} onChange={handleSearch} label="Search" variant="outlined" />
                </Grid> */}
                {editPostDialog()}
                {newPostDialog()}
                {gridPostList()}
                {quickEditDialog()}
            </Grid>
        </div>
    )
}


