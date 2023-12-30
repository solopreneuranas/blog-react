import '../App.css';
import { Grid, TextField, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import { postData, getData, serverURL } from '../Services/FetchNodeServices';
import React, { useRef } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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
    bgcolor: 'background.paper',
    boxShadow: 24,
    border: 'none',
    borderRadius: '15px',
    padding: '3%'
};


export default function CreateAuthor() {
    const classes = useStyles()

    const [getAuthorID, setAuthorID] = useState('')
    const [getAuthorName, setAuthorName] = useState('')
    const [getAuthorEmail, setAuthorEmail] = useState('')
    const [getAuthorPicture, setAuthorPicture] = useState({ bytes: '', filename: '' })
    const [getErrors, setErrors] = useState('')


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
        if (getAuthorPicture.filename.length === 0) {
            error = true
            handleError('Please upload picture', 'getAuthorPicture')
        }
        return error
    }


    const handleAuthorPicture = (event) => {
        setAuthorPicture({ bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) })
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


