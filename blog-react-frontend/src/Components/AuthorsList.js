import '../App.css';
import { Grid, TextField, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { postData, getData, serverURL } from '../Services/FetchNodeServices';
import React from 'react';
import ImageIcon from '@mui/icons-material/Image';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import CreateAuthor from './CreateAuthor';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'white',
    boxShadow: 24,
    border: 'none',
    borderRadius: '15px',
    padding: '3%'
};


export default function AuthorsList() {
    const classes = useStyles()

    const [getAuthorID, setAuthorID] = useState('')
    const [getAuthorName, setAuthorName] = useState('')
    const [getAuthorEmail, setAuthorEmail] = useState('')
    const [getAuthorPicture, setAuthorPicture] = useState({ bytes: '', filename: '' })
    const [getOldPicture, setOldPicture] = useState('')
    const [getDatabaseAuthor, setDatabaseAuthor] = useState([])
    const [getErrors, setErrors] = useState('')
    const [getBtnStatus, setBtnStatus] = useState(false)


    const fetchAuthor = async () => {
        var response = await getData('blog/fetch-author')
        setDatabaseAuthor(response.data)
    }

    useEffect(function () {
        fetchAuthor()
    }, [])

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (getAuthorName.length === 0) {
            error = true
            handleError('Please enter name', 'getAuthorName')
        }
        if (getAuthorEmail.length === 0) {
            error = true
            handleError('Please enter email', 'getAuthorEmail')
        }
        return error
    }


    const handleUpdateAuthorData = async () => {
        Swal.fire({
            title: 'Do you want to update the author?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Update',
            denyButtonText: `Don't update`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var error = validation()
                if (error === false) {
                    var body = { '_id': getAuthorID, 'name': getAuthorName, 'email': getAuthorEmail }
                    var response = await postData('blog/update-author-data', body)
                }
                fetchAuthor()
                Swal.fire('Author Updated!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Author not updated', '', 'info')
            }
        })
    }

    const handleUpdateAuthorPicture = async () => {
        var error = validation()
        if (error === false) {
            var formData = new FormData()
            formData.append('_id', getAuthorID)
            formData.append('picture', getAuthorPicture.bytes)
            var response = await postData('blog/update-author-picture', formData)
            if (response.status === true) {
                fetchAuthor()
                setBtnStatus(false)
                Swal.fire({
                    icon: 'success',
                    title: 'Picture updated!'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Picture not updated!'
                })
            }
        }
    }


    const handleAuthorPicture = (event) => {
        setAuthorPicture({ bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) })
        setBtnStatus(true)
    }

    const handlePictureCancel = () => {
        setBtnStatus(false)
        setAuthorPicture({ filename: getOldPicture, bytes: '' })
    }

    const handleAddAuthor = async () => {
        var error = validation()
        if (error === false) {
            var formData = new FormData()
            formData.append('name', getAuthorName)
            formData.append('email', getAuthorEmail)
            formData.append('picture', getAuthorPicture.bytes)
            var response = await postData('blog/create-author', formData)
            if (response.status === true) {
                fetchAuthor()
                Swal.fire({
                    icon: 'success',
                    title: 'Author added!'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Author not added!'
                })
            }
        }
    }

    const handleDeleteAuthor = async (authorID) => {
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
                var body = { _id: authorID }
                var response = await postData('blog/delete-author', body)
                fetchAuthor()
                Swal.fire(
                    'Deleted!',
                    'Author has been deleted.',
                    'success'
                )
            }
        })
    }


    const [authorDialog, setAuthorDialog] = useState(false)

    const handleAuthorDialogOpen = () => {
        setAuthorPicture({ bytes: '' })
        setAuthorDialog(true)
    }

    const closeAuthorDialog = () => {
        setAuthorDialog(false)
    }


    const createAuthor = () => {
        return (
            <div className='root'>
                <Grid container spacing={0} className='center'>
                    <Grid item md={12}>
                        <Button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            onFocus={() => handleError('', 'getCategoryPoster')}
                            error={getErrors.getCategoryPoster}
                            onChange={handleAuthorPicture} component='label'>
                            <input type='file' accept='images/*' hidden />
                            <Avatar src={getAuthorPicture.filename} style={{ width: '180px', height: '180px' }}>
                                <PersonIcon style={{ fontSize: '100px' }} />
                            </Avatar>
                        </Button>
                    </Grid>

                    <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: 0 }}>{getErrors.getAuthorPicture}</p>

                    <Grid container spacing={3} style={{ marginTop: '5%' }}>
                        <Grid item md={12}>
                            <TextField
                                className={classes.roundedTextField}
                                onFocus={() => handleError('', 'getAuthorName')}
                                error={getErrors.getAuthorName}
                                helperText={getErrors.getAuthorName}
                                fullWidth onChange={(event) => setAuthorName(event.target.value)} label='Name' />
                        </Grid>

                        <Grid item md={12}>
                            <TextField
                                className={classes.roundedTextField}
                                onFocus={() => handleError('', 'getAuthorEmail')}
                                error={getErrors.getAuthorEmail}
                                helperText={getErrors.getAuthorEmail}
                                fullWidth onChange={(event) => setAuthorEmail(event.target.value)} label='Email' />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginTop: '3%' }}>
                        <Grid item md={5} style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                            <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddAuthor} variant='outlined' style={{ marginRight: '2%', borderColor: '#0069ff', color: '#0069ff' }}>Add</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }

    const addAuthorDialog = () => {

        return (
            <div>
                <Modal
                    style={{ border: 'none' }}
                    open={authorDialog}
                    onClose={closeAuthorDialog}>
                    <Box sx={style}>
                        {createAuthor()}
                    </Box>
                </Modal>
            </div>
        )
    }

    const handleEditAuthor = (authorID, authorName, authorEmail, authorPicture) => {
        setEditAuthorDialogOpen(true)
        setAuthorName(authorName)
        setAuthorID(authorID)
        setAuthorEmail(authorEmail)
        setAuthorPicture({ filename: `${serverURL}/images/${authorPicture}`, bytes: '' })
        setOldPicture(`${serverURL}/images/${authorPicture}`)
    }

    const [editAuthorDialogOpen, setEditAuthorDialogOpen] = useState(false)

    const closeEditAuthorDialog = () => {
        setEditAuthorDialogOpen(false)
    }

    const editAuthorDialog = () => {

        return (
            <div>
                <Modal
                    style={{ border: 'none' }}
                    open={editAuthorDialogOpen}
                    onClose={closeEditAuthorDialog}>
                    <Box sx={style}>

                        <Button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            onFocus={() => handleError('', 'getCategoryPoster')}
                            error={getErrors.getCategoryPoster}
                            onChange={handleAuthorPicture} component='label'>
                            <input type='file' accept='images/*' hidden />
                            <Avatar src={getAuthorPicture.filename} style={{ width: '180px', height: '180px' }}>
                                <ImageIcon fontSize='large' />
                            </Avatar>
                        </Button>

                        <Typography style={{ color: '#0069ff', fontSize: '28px', fontWeight: 600, textAlign: 'center', marginTop: '3%' }}>{getAuthorName}</Typography>

                        {getBtnStatus ?
                            <Grid container spacing={0} className='center' style={{ marginTop: '5%' }}>
                                <Button startIcon={<SaveIcon />} variant='outlined' onClick={handleUpdateAuthorPicture} style={{ marginRight: '2%', borderColor: '#0069ff', color: '#0069ff' }}>
                                    Save
                                </Button>
                                <Button startIcon={<CancelIcon />} variant='outlined' onClick={handlePictureCancel} style={{ marginLeft: '2%', borderColor: 'red', color: 'red' }}>
                                    Cancel
                                </Button>
                            </Grid>
                            : <></>}

                        <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: 0 }}>{getErrors.getAuthorPicture}</p>

                        <Grid container spacing={3} style={{ marginTop: '1%' }}>
                            <Grid item md={12}>
                                <TextField
                                    className={classes.roundedTextField}
                                    onFocus={() => handleError('', 'getAuthorName')}
                                    error={getErrors.getAuthorName}
                                    helperText={getErrors.getAuthorName}
                                    fullWidth value={getAuthorName} onChange={(event) => setAuthorName(event.target.value)} label='Name' />
                            </Grid>

                            <Grid item md={12}>
                                <TextField
                                    className={classes.roundedTextField}
                                    onFocus={() => handleError('', 'getAuthorEmail')}
                                    error={getErrors.getAuthorEmail}
                                    helperText={getErrors.getAuthorEmail}
                                    fullWidth value={getAuthorEmail} onChange={(event) => setAuthorEmail(event.target.value)} label='Email' />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginTop: '3%' }}>
                            <Grid item md={5} style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                                <Button startIcon={<SaveIcon />} onClick={handleUpdateAuthorData} variant='outlined' style={{ marginRight: '2%', borderColor: '#0069ff', color: '#0069ff' }}>Update</Button>
                                <Button startIcon={<DeleteIcon />} onClick={() => handleDeleteAuthor(getAuthorID)} variant='outlined' style={{ marginLeft: '4%', borderColor: 'red', color: 'red' }}>Delete</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </div>
        )
    }



    const gridAuthorList = () => {
        const sortedAuthorList = getDatabaseAuthor.sort((a, b) => a.name > b.name ? 1 : -1)
        return (
            <Grid container spacing={1} style={{ padding: '3% 10% 3% 7%', margin: 0 }}>
                <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center', marginBottom: '4%' }}>
                    <Grid item xs={6}>
                        <span style={{ fontWeight: '600', fontSize: '25px' }}>Authors</span>
                    </Grid>
                </Grid>
                <Grid
                    className='element-hover'
                    onClick={handleAuthorDialogOpen} item md={3} style={{
                        borderRadius: '20px',
                        background: 'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        padding: '2% 0',
                        marginRight: '3%',
                        marginBottom: '3%',
                        border: '5px dashed #0069ff'
                    }}>
                    <AddCircleOutlineIcon style={{ color: '#0069ff', fontSize: '80px' }} />
                </Grid>
                {sortedAuthorList.map((item, index) => {

                    return (
                        <Grid item md={3} style={{
                            boxShadow: '0 0 30px gainsboro',
                            borderRadius: '20px',
                            background: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2% 0',
                            marginRight: '3%',
                            marginBottom: '3%',
                            position: 'relative'
                        }}>
                            <EditIcon className='element-hover' style={{ position: 'absolute', zIndex: '999', right: '5%', top: '5%', opacity: '50%' }} onClick={() => handleEditAuthor(item._id, item.name, item.email, item.picture)} />
                            <center>
                                <img src={`${serverURL}/images/${item.picture}`} style={{ width: 100, height: 100, borderRadius: '50%' }} />
                                <Typography style={{ fontWeight: 600, fontSize: '27px', marginTop: '5%' }}>{item.name}</Typography>
                                <Typography style={{ fontWeight: 500, fontSize: '17px', opacity: '70%' }}>{item.email}</Typography>
                                <Typography style={{ fontWeight: 500, fontSize: '17px', opacity: '70%' }}>No. of Posts - 5</Typography>
                            </center>
                        </Grid>
                    )
                })}
            </Grid>
        );
    }



    return (
        <div className='root' style={{ height: '100%' }}>
            <Grid container spacing={1}>
                {gridAuthorList()}
                {addAuthorDialog()}
                {editAuthorDialog()}
            </Grid>
        </div>
    )
}


