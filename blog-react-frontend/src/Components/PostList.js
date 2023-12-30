import '../App.css';
import { Grid, TextField, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from '@mui/x-data-grid';
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
import FolderIcon from '@mui/icons-material/Folder';
import { postData, getData, serverURL } from '../Services/FetchNodeServices';
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import ImageIcon from '@mui/icons-material/Image';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import CreatePost from './CreatePost';

export default function PostList() {
    const [getPostList, setPostList] = useState([])
    const [getPostID, setPostID] = useState('')
    const [getFocus, setFocus] = useState(false)
    const [getTitle, setTitle] = useState('')
    const [getBody, setBody] = useState('')
    const [getDate, setDate] = useState(null)
    const [getAuthor, setAuthor] = useState('')
    const [getCategory, setCategory] = useState([])
    const [getTags, setTags] = useState('')
    const [getPoster, setPoster] = useState({ bytes: '', filename: '' })
    const [getBtnStatus, setBtnStatus] = useState(false)
    const [getOldPoster, setOldPoster] = useState('')
    const [getDeleteBtn, setDeleteBtn] = useState(false)
    const [getSearch, setSearch] = useState('')
    const [getDatabaseCategory, setDatabaseCategory] = useState([])
    const [tagsText, setTagsText] = React.useState('')
    const [chipData, setChipData] = React.useState([])


    const handleSearch = async (event) => {
        setSearch(event.target.value)
        var filteredPosts = getPostList.filter((item) => {
            if (item.title.toLowerCase().includes(getSearch.toLowerCase())) {
                return true
            }
        })
        setPostList(filteredPosts)
    }


    const categoryArray = () => {
        return getCategory.map((item, i) => {
            return { item }
        })
    }
    //console.log('RESULT', getCategory)

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));


    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key))
    };

    const handleTagsInputChange = (event) => {
        setTagsText(event.target.value)
    };

    const handleAddTags = () => {
        if (tagsText.trim() !== '') {
            // Only add a Tags if it's not empty
            const newTag = { key: chipData.length, label: tagsText }
            setChipData([...chipData, newTag])
            setTagsText('')
        }
    };

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
                    <Grid container spacing={5}>

                        <Grid item md={12} className='center'>
                            <Button
                                onFocus={() => handleError('', 'getCategoryPoster')}
                                error={getErrors.getCategoryPoster}
                                onChange={handleCategoryPoster} component='label'>
                                <input type='file' accept='images/*' hidden />
                                <Avatar src={getCategoryPoster.filename} style={{ width: '200px', height: '200px' }}>
                                    <ImageIcon fontSize='large' />
                                </Avatar>
                            </Button>
                        </Grid>
                        <Grid item md={12} className='center' style={{ marginTop: 0 }}>
                            <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: 0 }}>{getErrors.getCategoryPoster}</p>
                        </Grid>

                        <Grid item md={12} style={{ marginTop: 0 }}>
                            <TextField
                                error={getErrors.getCategoryName}
                                helperText={getErrors.getCategoryName}
                                onFocus={() => handleError('', 'getCategoryName')} fullWidth label='Category Name'
                                onChange={(event) => setCategoryName(event.target.value)} />
                        </Grid>

                        <Grid item md={12} className='center'>
                            <Button style={{
                                background: '#004cef',
                                padding: '3% 6%'
                            }}
                                onClick={handleSubmitCategory} variant='contained'>Add Category</Button>
                        </Grid>
                    </Grid>
                </div>

            </div >
        )

    }

    // Add Category END //



    // Constant of Post Edit START //

    const handlePosterUpdate = async () => {
        var formData = new FormData()
        formData.append('poster', getPoster.bytes)
        formData.append('_id', getPostID)
        var response = await postData('blog/update-post-poster', formData)
        if (response.status === true) {
            Swal.fire({
                icon: 'success',
                title: 'Poster updated!'
            })
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Poster not updated!'
            })
        }
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
            confirmButtonColor: '#004cef',
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

    useEffect(function () {
        fetchCategory()
    })

    //Const of Post Edit END //



    // Edit Post Dialog START //

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (postID, postTitle, postCategory, postBody, postDate, postAuthor, postTags, postPoster) => {
        setOpen(true);
        setBody(postBody)
        setPostID(postID)
        setTitle(postTitle)
        setAuthor(postAuthor)
        setDate(postDate)
        setCategory(postCategory)
        setTagsText(postTags)
        setPoster({ filename: `${serverURL}/images/${postPoster}`, bytes: '' })
        setOldPoster(`${serverURL}/images/${postPoster}`)
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
                    <AppBar sx={{ position: 'relative', background: '#004cef' }}>
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
                            <Button autoFocus color="inherit" onClick={handleUpdatePost}>
                                Update
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <div>
                        {editPost()}
                    </div>
                </Dialog>
            </div>
        );
    }

    // Edit Post Dialog END //


    // Edit Post Full Component START //

    const editPost = () => {


        const BlogEditor = () => {
            const editorRef = useRef(null);
            const log = () => {
                if (editorRef.current) {
                    console.log(editorRef.current.getContent());
                }
            };

            return (
                <>
                    <div className='blog-editor'>
                        <Editor
                            onEditorChange={handleBody}
                            apiKey='culv1et9w5eu1ohce78h9mzcndr0as09n8clgz6l7pb5lk1p'
                            onInit={(evt, editor) => editorRef.current = editor}
                            initialValue={getBody}
                            init={{
                                height: 900,
                                menubar: true,
                                plugins: [
                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                ],
                                toolbar: 'undo redo | blocks | ' +
                                    'bold italic forecolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help',
                                content_style: 'body { font-family:Poppins; font-size:16px }'
                            }}
                        />
                    </div>
                </>
            );
        }


        // Category Chip Section START //

        const Category = () => {

            return (
                <Stack spacing={3}>
                    <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={getDatabaseCategory}
                        getOptionLabel={(category) => category.categoryname}
                        //value={categoryArray}
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


        // var tagsChipLabel = chipData.map(data => data.label)


        return (
            <div className='root'>
                <div className='box'>
                    <Grid container spacing={5}>
                        <Grid item md={12}>
                            <TextField
                                value={getTitle}
                                onChange={(event) => setTitle(event.target.value)}
                                variant='standard' fullWidth label='Add Title'
                            />
                        </Grid>
                        <Grid item md={9}>
                            {BlogEditor()}
                        </Grid>
                        <Grid item md={3}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Date" value={dayjs(getDate)} onChange={handleDate} />
                                </DemoContainer>
                            </LocalizationProvider>
                            <TextField
                                value={getAuthor}
                                onChange={(event) => setAuthor(event.target.value)} fullWidth label='Author' variant='standard' style={{ marginTop: '10%' }} />
                            <div style={{ marginTop: '15%' }}>
                                {Category()}
                            </div>
                            <TextField
                                fullWidth
                                label='Tags'
                                variant='standard'
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
                                component="ul"
                            >
                                {chipData.map((data) => {
                                    let icon;

                                    if (data.label === 'React') {
                                        icon = <TagFacesIcon />;
                                    }

                                    return (
                                        <ListItem key={data.key}>
                                            <Chip
                                                icon={icon}
                                                label={data.label}
                                                onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                                            />
                                        </ListItem>
                                    );
                                })}
                            </Paper>
                            <Button
                                onChange={handlePoster}
                                fullWidth component='label'
                                style={{
                                    border: '2px dotted gainsboro',
                                    fontWeight: '500',
                                    color: 'gray',
                                    marginTop: '10%',
                                    padding: '6% 0'
                                }}>
                                <input type='file' hidden accept='images/*' />
                                <Avatar style={{ marginRight: '5%' }}>
                                    <FolderIcon />
                                </Avatar>
                                Upload Poster
                            </Button>
                            <div style={{ marginTop: '10%' }}>
                                <img src={getPoster.filename} style={{ width: '100%', borderRadius: '10px' }} />
                            </div>

                            {getBtnStatus ? <Grid container spacing={2} className='left'>
                                <Grid item md={3} className='left'>
                                    <Button variant='outlined' onClick={handlePosterUpdate}>
                                        Save
                                    </Button>
                                </Grid>
                                <Grid item md={9} className='left'>
                                    <Button variant='outlined' onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                                : <></>}
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
    const handleUpdatePost = async () => {
        var body = { '_id': getPostID, 'title': getTitle, 'body': getBody, 'date': getDate, 'author': getAuthor }
        var response = await postData('blog/update-post-data', body)
        if (response.status === true) {
            fetchPostList()
            Swal.fire({
                icon: 'success',
                title: 'Post updated!'
            })
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Post not updated!'
            })
        }
    }

    // Edit Post Full Component END //


    const fetchPostList = async () => {
        var response = await getData('blog/display-post-list')
        setPostList(response.postListData)
    }

    useEffect(function () {
        fetchPostList()
    }, [])

    const columns = [
        { field: 'title', headerName: 'Title', width: 800 },
        { field: 'category', headerName: 'Category', width: 300 },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 100,
            renderCell: (params) => (
                <Button
                    startIcon={<EditIcon style={{ color: '#004cef' }} />}

                    onClick={() => handleClickOpen(params.row._id, params.row.title, params.row.category, params.row.body, params.row.date, params.row.author, params.row.tags, params.row.poster)}>
                </Button>
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 100,
            renderCell: (params) => (
                <Button
                    startIcon={<DeleteIcon style={{ color: 'red' }} />}

                    onClick={() => handleDeletePost(params.row._id)}>
                </Button>
            ),
        },
    ];


    const postListTable = () => {
        return (
            <div style={{ height: 'auto', width: '100%' }}>
                <DataGrid
                    rows={getPostList}
                    columns={columns}
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 15]}
                    checkboxSelection
                />
            </div>
        );
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
                    <AppBar sx={{ position: 'relative', background: '#004cef' }}>
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



    return (
        <div className='root'>
            <div className='box'>
                <Grid container spacing={0}>
                    <Grid item md={1} style={{ marginBottom: '2%' }}>
                        <Button fullWidth variant="outlined" onClick={handleCreatePostDialog}>
                            Add Post
                        </Button>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item md={6}>
                            <TextField onChange={handleSearch} label="Search" variant="standard" />
                        </Grid>
                    </Grid>
                    {editPostDialog()}
                    {postListTable()}
                    {newPostDialog()}
                </Grid>
            </div>
        </div>
    )
}


