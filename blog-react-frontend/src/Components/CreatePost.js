import '../App.css';
import { Grid, TextField, Button, Avatar } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import FolderIcon from '@mui/icons-material/Folder';
import { postData, getData } from '../Services/FetchNodeServices';
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import ImageIcon from '@mui/icons-material/Image';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useMemo } from "react";
import { makeStyles } from '@material-ui/core/styles';
import CreateCategory from './CreateCategory';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))


export default function CreatePost() {

    const classes = useStyles();

    const [getFocus, setFocus] = useState(false)
    const [getTitle, setTitle] = useState('')
    const [getDate, setDate] = useState(null)
    const [getAuthor, setAuthor] = useState('')
    const [getCategory, setCategory] = useState([])
    const [getBody, setBody] = useState('')
    const [getPoster, setPoster] = useState({ bytes: '', filename: '' })
    const [getDatabaseCategory, setDatabaseCategory] = useState([])
    const [getDatabaseAuthor, setDatabaseAuthor] = useState([])
    const [getCategoryName, setCategoryName] = useState('')
    const [getCategoryPoster, setCategoryPoster] = useState({ bytes: '', filename: '' })
    const [getErrors, setErrors] = useState('')

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (getTitle.length === 0) {
            error = true
            handleError('Please enter title', 'getTitle')
        }
        if (getCategory.length === 0) {
            error = true
            handleError('Please enter category', 'getCategory')
        }
        if (getBody.length === 0) {
            error = true
            handleError('Please enter something...', 'getBody')
        }
        if (getCategory.length === 0) {
            error = true
            handleError('Please enter category', 'getCategory')
        }
        if (getPoster.filename.length === 0) {
            error = true
            handleError('Please upload poster', 'getPoster')
        }
        return error
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

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value);
    };

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));

    const [tagsText, setTagsText] = useState(''); // State to store the entered category
    const [chipData, setChipData] = useState([]);

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
    };

    const handleTagsInputChange = (event) => {
        setTagsText(event.target.value);
    };

    const handleAddTags = () => {
        if (tagsText.trim() !== '') {
            // Only add a category if it's not empty
            const newTag = tagsText
            setChipData([...chipData, newTag]);
            setTagsText(''); // Clear the input field
        }
    };

    const handleTagsInputKeyPress = (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            setTagsText('');
            handleAddTags();
        }
    };

    const handlePoster = (event) => {
        setPoster({ bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) })
        console.log("Poster EVENT>>", event.target.files[0])
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


    const Category = () => {

        return (
            <Stack spacing={3}>

                <Autocomplete
                    error={getErrors.getCategory}
                    onFocus={() => handleError('', 'getCategory')}
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

                <Grid item md={12} className='left' style={{ marginTop: '2%' }}>
                    <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: 0 }}>{getErrors.getCategory}</p>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item md={12}>
                        {addCatgeoryDialog()}
                    </Grid>
                </Grid>
            </Stack>
        );
    }

    console.log(getCategory)

    var categoryArray = getCategory.map(item => item.categoryname)
    var tagsString = chipData.join(',');

    const handlePublish = async () => {
        var error = validation()
        if (error === false) {
            var formData = new FormData()
            formData.append('title', getTitle)
            formData.append('category', categoryArray)
            formData.append('tags', tagsString)
            formData.append('author', getAuthor)
            formData.append('date', getDate)
            formData.append('body', getBody)
            formData.append('poster', getPoster.bytes)
            var response = await postData('blog/create-post', formData)
            if (response.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Post published!'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Post not published!'
                })
            }
        }
    }


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
                            <CreateCategory />
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
                                background: '#0069ff',
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


    return (
        <div className='root'>
            <div className='box' style={{ padding: '2%' }}>
                <Grid container spacing={5}>
                    <Grid item md={12}>
                        <TextField
                            error={getErrors.getTitle}
                            helperText={getErrors.getTitle}
                            onFocus={() => handleError('', 'getTitle')}
                            className={classes.roundedTextField}
                            onChange={(event) => setTitle(event.target.value)}
                            variant='outlined' fullWidth label='Add Title'
                        />
                    </Grid>

                    <Grid item md={9}>
                        <ReactQuill
                            error={getErrors.getBody}
                            onFocus={() => handleError('', 'getBody')}
                            theme="snow" value={getBody} onChange={handleQuill} modules={modules} />
                        <div className='left'>
                            <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: '0' }}>{getErrors.getBody}</p>
                        </div>
                    </Grid>

                    <Grid item md={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Date" onChange={handleDate} className={classes.roundedTextField} />
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
                            component="ul"
                        >
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
                        <Grid item md={12} className='left'>
                            <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: '2%' }}>{getErrors.getPoster}</p>
                        </Grid>
                        <div style={{ marginTop: '10%' }}>
                            <img src={getPoster.filename} style={{ width: '100%', borderRadius: '10px' }} />
                        </div>

                        <Button onClick={handlePublish} variant='contained' style={{ background: '#0069ff', padding: '3% 9%', marginTop: '5%' }}>
                            Publish
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </div >
    );
}
