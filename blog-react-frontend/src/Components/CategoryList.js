import '../App.css';

import * as React from 'react';
import { Grid, TextField, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import { getData, postData, serverURL } from '../Services/FetchNodeServices';
import Swal from 'sweetalert2'
import ImageIcon from '@mui/icons-material/Image';
import MaterialTable from '@material-table/core';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CreateCategory from './CreateCategory'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CategoryIcon from '@mui/icons-material/Category';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))


export default function CategoryList() {
    const classes = useStyles()

    const [getCategoryId, setCategoryId] = useState('')
    const [getCategoryName, setCategoryName] = useState('')
    const [getPoster, setPoster] = useState({ bytes: '', filename: '' })
    const [getCategoryList, setCategoryList] = useState([])
    const [getBtnStatus, setBtnStatus] = useState(false)
    const [open, setOpen] = useState(false)
    const [createCategory, setCreateCategory] = useState(false)
    const [getOldPoster, setOldPoster] = useState('')
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
        return error
    }

    const handlePoster = (event) => {
        setPoster({ bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) })
        setBtnStatus(true)
    }

    const handleClickOpen = (catID, catName, catPoster) => {
        setOpen(true);
        setCategoryId(catID)
        setCategoryName(catName)
        setPoster({ filename: `${serverURL}/images/${catPoster}`, bytes: '' })
        setOldPoster(`${serverURL}/images/${catPoster}`)
    }

    const handleDeleteCategory = (catID) => {
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
                var body = { _id: catID }
                var response = await postData('blog/delete-category', body)
                displayCategoryList()
                Swal.fire(
                    'Deleted!',
                    'Category has been deleted.',
                    'success'
                )
            }
        })
    }

    const handleCreateCategory = () => {
        setCreateCategory(true)
    }

    const handleClose = () => {
        setOpen(false);
        setCreateCategory(false)
    }


    const displayCategoryList = async () => {
        var response = await getData('blog/display-category-list')
        setCategoryList(response.categoryData)
    }

    const handleCancelPoster = () => {
        setBtnStatus(false)
        setPoster({ filename: getOldPoster, bytes: '' })
    }



    const handleUpdatePoster = async () => {
        var formData = new FormData()
        formData.append('poster', getPoster.bytes)
        formData.append('_id', getCategoryId)
        var response = await postData('blog/update-category-poster', formData)
        if (response.status === true) {
            displayCategoryList()
            setBtnStatus(false)
            Swal.fire({
                icon: 'success',
                title: 'Updated...',
                text: 'Category Poster has been updated!'
            })
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'Category Poster has not been updated!'
            })
        }
    }

    useEffect(function () {
        displayCategoryList()
    }, [])



    //Create Category Dialog

    const CreateCategoryDialog = () => {
        return (
            <div>
                <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item xs={6}>
                        <span style={{ fontWeight: '600', fontSize: '25px' }}>Category</span>
                    </Grid>
                    <Grid item xs={6}>
                        <span><Fab onClick={handleCreateCategory} style={{ background: '#0069ff', color: 'white', display: 'flex', marginLeft: 'auto' }}>
                            <AddIcon />
                        </Fab></span>
                    </Grid>
                </Grid>

                <Dialog
                    open={createCategory}
                    onClose={handleClose} >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <CreateCategory />
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }



    //Edit Category Dialog

    const EditCategoryDialog = () => {
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose} >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {EditCategory()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button startIcon={<SaveIcon />} onClick={handleUpdateCategoryData} variant='outlined' style={{ marginRight: '1%', borderColor: '#0069ff', color: '#0069ff' }}>Update</Button>
                        <Button startIcon={<CancelIcon />} onClick={handleClose} variant='outlined' style={{ marginLeft: '1%', borderColor: 'red', color: 'red' }}>close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }


    const handleUpdateCategoryData = async () => {

        Swal.fire({
            title: 'Do you want to update the category?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Update',
            denyButtonText: `Don't update`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var error = validation()
                if (error === false) {
                    var body = { categoryname: getCategoryName, _id: getCategoryId }
                    var response = await postData('blog/update-category-data', body)
                }
                displayCategoryList()
                Swal.fire('Category Updated!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Category not updated', '', 'info')
            }
        })
    }

    const EditCategory = () => {

        return (
            <div>
                <div style={{ padding: '5%' }}>
                    <Grid container spacing={1}>

                        <Grid item md={12}>
                            <h3 style={{fontWeight: '600', fontSize: '23px', color: '#0069ff'}}><span style={{color: 'black'}}>Category:</span> {getCategoryName}</h3>
                        </Grid>


                        <Grid item md={12} className='center'>
                            <Button
                                onChange={handlePoster} component='label'>
                                <Avatar src={getPoster.filename} style={{ width: '200px', height: '200px' }}>
                                </Avatar>
                                <input type='file' accept='images/*' hidden />
                            </Button>
                        </Grid>

                        {getBtnStatus ? <Grid container spacing={0} className='center' style={{margin: '3% 0'}}>
                            <Grid item md={6} className='right'>
                                <Button startIcon={<SaveIcon />} onClick={handleUpdatePoster} variant='outlined' style={{ marginRight: '2%', borderColor: '#0069ff', color: '#0069ff' }}>Update</Button>
                            </Grid>
                            <Grid item md={6} className='left'>
                                <Button startIcon={<CancelIcon />} onClick={handleCancelPoster} variant='outlined' style={{ marginLeft: '2%', borderColor: 'red', color: 'red' }}>Cancel</Button>
                            </Grid>
                        </Grid>
                            : <></>}

                        <Grid item md={12}>
                            <TextField
                                className={classes.roundedTextField}
                                error={getErrors.getCategoryName}
                                helperText={getErrors.getCategoryName}
                                onFocus={() => handleError('', 'getCategoryName')}
                                value={getCategoryName} fullWidth label='Category Name'
                                onChange={(event) => setCategoryName(event.target.value)} />
                        </Grid>
                    </Grid>
                </div>

            </div >
        )

    }

    //Category Table//

    const columns = [
        { field: 'categoryname', headerName: 'Title', width: 1100 },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 100,
            renderCell: (params) => (
                <Button
                    startIcon={<EditIcon style={{ color: '#004cef' }} />}

                    onClick={() => handleClickOpen(params.row._id, params.row.categoryname, params.row.poster)}>
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
                    onClick={() => handleDeleteCategory(params.row._id)}>
                </Button>
            ),
        },
    ];

    const CategoryTable = () => {
        return (

            <div style={{ height: 'auto', width: '100%', marginTop: '3%' }}>
                <DataGrid
                    style={{ padding: '1%', border: 'none' }}
                    rows={getCategoryList}
                    columns={columns}
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 15]}
                />
            </div>
        )
    }

    return (
        <div className='root'>
            <div className='box' style={{ width: '90%', marginTop: '3%' }}>
                <Grid container spacing={0}>
                    <Grid item md={12}>
                        {CreateCategoryDialog()}
                        {EditCategoryDialog()}
                        {CategoryTable()}
                    </Grid>
                </Grid>
            </div>

        </div >
    )

}