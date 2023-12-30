import '../App.css';
import { Grid, TextField, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid, GridMoreVertIcon } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { postData, getData, serverURL } from '../Services/FetchNodeServices';
import React, { useRef } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))


export default function Admin() {

    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    const classes = useStyles();

    const [getAdminID, setAdminID] = useState('')
    const [getAdminName, setAdminName] = useState('')
    const [getAdminEmail, setAdminEmail] = useState('')
    const [getAdminPhone, setAdminPhone] = useState('')
    const [getAdminPassword, setAdminPassword] = useState('')
    const [getAdminPicture, setAdminPicture] = useState({ bytes: '', filename: '' })
    const [getOldPicture, setOldPicture] = useState('')
    const [getErrors, setErrors] = useState('')
    const [getDatabaseAdmin, setDatabaseAdmin] = useState([])
    const [getBtnStatus, setBtnStatus] = useState(false)


    const fetchAdmin = async () => {
        var response = await getData('blog/fetch-admin')
        setDatabaseAdmin(response.data)
    }

    useEffect(function () {
        fetchAdmin()
    }, [])


    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (getAdminName.length === 0) {
            error = true
            handleError('Please enter name', 'getAdminName')
        }
        if (getAdminEmail.length === 0) {
            error = true
            handleError('Please enter email', 'getAdminEmail')
        }
        if (getAdminPassword.length === 0) {
            error = true
            handleError('Please enter email', 'getAdminPassword')
        }
        if (getAdminPhone.length === 0) {
            error = true
            handleError('Please enter email', 'getAdminPhone')
        }
        if (getAdminPicture.filename.length === 0) {
            error = true
            handleError('Please upload picture', 'getAdminPicture')
        }
        return error
    }



    const handleUpdateAdminData = async () => {
        var error = validation()
        if (error === false) {
            var body = { '_id': getAdminID, 'name': getAdminName, 'email': getAdminEmail, 'password': getAdminPassword, 'phone': getAdminPhone }
            var response = await postData('blog/update-admin-data', body)
            if (response.status === true) {
                fetchAdmin()
                Swal.fire({
                    icon: 'success',
                    title: 'Admin updated!'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Admin not updated!'
                })
            }
        }
    }

    const handleUpdateAdminPicture = async () => {
        var error = validation()
        if (error === false) {
            var formData = new FormData()
            formData.append('_id', getAdminID)
            formData.append('picture', getAdminPicture.bytes)
            var response = await postData('blog/update-admin-picture', formData)
            if (response.status === true) {
                fetchAdmin()
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


    const handleAdminPicture = (event) => {
        setAdminPicture({ bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) })
        setBtnStatus(true)
    }

    const handlePictureCancel = () => {
        setBtnStatus(false)
        setAdminPicture({ filename: getOldPicture, bytes: '' })
    }


    const [adminDialog, setAdminDialog] = useState(false)

    const handleAdminDialogOpen = () => {
        setAdminDialog(true)
    }

    const closeAdminDialog = () => {
        setAdminDialog(false)
    }

    const addAdminDialog = () => {

        return (
            <div>
                <Modal
                    style={{ border: 'none' }}
                    open={adminDialog}
                    onClose={closeAdminDialog}>
                    <Box sx={style}>
                    </Box>
                </Modal>
            </div>
        )
    }


    const handleEditAdmin = (adminID, adminName, adminEmail, adminPhone, adminPassword, adminPicture) => {
        setEditAdminDialogOpen(true)
        setAdminName(adminName)
        setAdminID(adminID)
        setAdminEmail(adminEmail)
        setAdminPassword(adminPassword)
        setAdminPhone(adminPhone)
        setAdminPicture({ filename: `${serverURL}/images/${adminPicture}`, bytes: '' })
        setOldPicture(`${serverURL}/images/${adminPicture}`)
    }

    const [editAdminDialogOpen, setEditAdminDialogOpen] = useState(false)

    const closeEditAdminDialog = () => {
        setEditAdminDialogOpen(false)
    }

    const editAdminDialog = () => {

        return (
            <div>
                <Modal
                    style={{ border: 'none' }}
                    open={editAdminDialogOpen}
                    onClose={closeEditAdminDialog}>
                    <Box sx={style}>

                        <Button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            onFocus={() => handleError('', 'getCategoryPoster')}
                            error={getErrors.getCategoryPoster}
                            onChange={handleAdminPicture} component='label'>
                            <input type='file' accept='images/*' hidden />
                            <Avatar src={getAdminPicture.filename} style={{ width: '180px', height: '180px' }}>
                                <ImageIcon fontSize='large' />
                            </Avatar>
                        </Button>

                        <Typography style={{ color: '#0069ff', fontSize: '28px', fontWeight: 600, textAlign: 'center', marginTop: '3%' }}>{getAdminName}</Typography>

                        {getBtnStatus ?
                            <Grid container spacing={0} className='center' style={{ marginTop: '5%' }}>
                                <Button startIcon={<SaveIcon />} variant='outlined' onClick={handleUpdateAdminPicture} style={{ marginRight: '2%', borderColor: '#0069ff', color: '#0069ff' }}>
                                    Save
                                </Button>
                                <Button startIcon={<CancelIcon />} variant='outlined' onClick={handlePictureCancel} style={{ marginLeft: '2%', borderColor: 'red', color: 'red' }}>
                                    Cancel
                                </Button>
                            </Grid>
                            : <></>}

                        <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: 0 }}>{getErrors.getAdminPicture}</p>

                        <Grid container spacing={3} style={{ marginTop: '1%' }}>
                            <Grid item md={6}>
                                <TextField
                                    className={classes.roundedTextField}
                                    onFocus={() => handleError('', 'getAdminName')}
                                    error={getErrors.getAdminName}
                                    helperText={getErrors.getAdminName}
                                    fullWidth value={getAdminName} onChange={(event) => setAdminName(event.target.value)} label='Name' />
                            </Grid>

                            <Grid item md={6}>
                                <TextField
                                    className={classes.roundedTextField}
                                    onFocus={() => handleError('', 'getAdminEmail')}
                                    error={getErrors.getAdminEmail}
                                    helperText={getErrors.getAdminEmail}
                                    fullWidth value={getAdminEmail} onChange={(event) => setAdminEmail(event.target.value)} label='Email' />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} style={{ marginTop: '1%' }}>
                            <Grid item md={6}>
                                <TextField
                                    className={classes.roundedTextField}
                                    onFocus={() => handleError('', 'getAdminPhone')}
                                    error={getErrors.getAdminPhone}
                                    helperText={getErrors.getAdminPhone}
                                    fullWidth value={getAdminPhone} onChange={(event) => setAdminPhone(event.target.value)} label='Phone' />
                            </Grid>

                            <Grid item md={6}>
                                <FormControl fullWidth variant="outlined" className={classes.roundedTextField}>
                                    <InputLabel >Password</InputLabel>
                                    <OutlinedInput
                                        label="Password"
                                        value={getAdminPassword}
                                        error={getErrors.getAdminPassword}
                                        onFocus={() => handleError('', 'getAdminPassword')}
                                        onChange={(event) => setAdminPassword(event.target.value)}
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                {/* <TextField
                                    className={classes.roundedTextField}
                                    onFocus={() => handleError('', 'getAdminPassword')}
                                    error={getErrors.getAdminPassword}
                                    helperText={getErrors.getAdminPassword}
                                    fullWidth value={getAdminPassword} onChange={(event) => setAdminPassword(event.target.value)} label='Password' /> */}
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginTop: '3%' }}>
                            <Grid item md={5} style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                                <Button startIcon={<SaveIcon />} onClick={handleUpdateAdminData} variant='outlined' style={{ marginRight: '2%', borderColor: '#0069ff', color: '#0069ff' }}>Update</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </div>
        )
    }



    const gridAdminList = () => {

        return (
            <Grid container spacing={5} style={{ padding: '4%', margin: 0 }}>

                {getDatabaseAdmin.map((item, index) => {

                    return (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'start', position: 'relative' }}>
                            <Grid item md={4} style={{
                                padding: '2% 0'
                            }}>
                                <EditIcon className='element-hover' style={{ position: 'absolute', right: '5%', top: '5%', opacity: '50%' }} onClick={() => handleEditAdmin(getDatabaseAdmin[0]._id, getDatabaseAdmin[0].name, getDatabaseAdmin[0].email, getDatabaseAdmin[0].phone, getDatabaseAdmin[0].password, getDatabaseAdmin[0].picture)} />

                                <center>
                                    <img src={`${serverURL}/images/${item.picture}`} style={{ width: 180, height: 180, borderRadius: '50%' }} />
                                    <Typography style={{ fontWeight: 600, fontSize: '27px', marginTop: '5%' }}>{item.name}</Typography>
                                    <Typography style={{ fontWeight: 500, fontSize: '17px', opacity: '70%' }}>{item.email}</Typography>
                                </center>
                            </Grid>

                            <Grid item md={6} style={{
                                background: 'white',
                                padding: '2% 0'
                            }}>
                                <Grid item xs={6} style={{ marginBottom: '5%' }}>
                                    <span style={{ fontWeight: '600', fontSize: '25px' }}>Admin</span>
                                    <p style={{ opacity: '80%', fontSize: '14px' }}>This information can be edited</p>
                                </Grid>

                                <Grid container spacing={3} style={{ paddingRight: '3%' }}>
                                    <Grid item xs={6}>
                                        <TextField className={classes.roundedTextField} label="Name" fullWidth value={item.name} />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField className={classes.roundedTextField} label="Email" fullWidth value={item.email} />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField className={classes.roundedTextField} label="Number" fullWidth value={item.phone} />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <FormControl fullWidth variant="outlined" className={classes.roundedTextField}>
                                            <InputLabel >Password</InputLabel>
                                            <OutlinedInput
                                                label="Password"
                                                value={item.password}
                                                error={getErrors.getAdminPassword}
                                                onFocus={() => handleError('', 'getAdminPassword')}
                                                onChange={(event) => setAdminPassword(event.target.value)}
                                                type={showPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Button variant='contained' onClick={() => handleEditAdmin(getDatabaseAdmin[0]._id, getDatabaseAdmin[0].name, getDatabaseAdmin[0].email, getDatabaseAdmin[0].phone, getDatabaseAdmin[0].password, getDatabaseAdmin[0].picture)}
                                            style={{
                                                background: '#0069ff',
                                                boxShadow: 'none',
                                                padding: '3% 7%',
                                                borderRadius: '8px'
                                            }}>Update</Button>
                                    </Grid>

                                </Grid>

                            </Grid>
                        </div>
                    )
                })}


            </Grid>
        );
    }



    return (
        <div className='root' style={{ height: '100%' }}>
            <Grid container spacing={0}>
                {gridAdminList()}
                {addAdminDialog()}
                {editAdminDialog()}
            </Grid>
        </div>
    )
}


