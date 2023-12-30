import { Grid, TextField, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import { getData, postData } from '../Services/FetchNodeServices';
import Swal from 'sweetalert2'
import ImageIcon from '@mui/icons-material/Image';
import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from "react";
import ReactQuill from 'react-quill';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import dayjs from 'dayjs';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function Page() {
    const classes = useStyles()

    const [getPageId, setPageId] = useState('')
    const [getPageTitle, setPageTitle] = useState('')
    const [getPageBody, setPageBody] = useState('')
    const [getPageDate, setPageDate] = useState(null)
    const [open, setOpen] = useState(false)
    const [openCreatePageDialog, setOpenCreatePageDialog] = useState(false)
    const [getErrors, setErrors] = useState('')
    const [getDatabasePages, setDatabasePages] = useState([])


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
        setPageBody(newValue)
        if (newValue.trim() !== '') {
            handleError('', 'body');
        }
    }


    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (getPageTitle.length === 0) {
            error = true
            handleError('Please enter page title', 'getPageTitle')
        }
        return error
    }

    const fetchPages = async () => {
        var response = await getData('blog/display-pages-list')
        setDatabasePages(response.data)
    }

    useEffect(function () {
        fetchPages()
    })

    const handleSubmitPage = async () => {
        var error = validation()
        if (error === false) {
            var body = { 'title': getPageTitle, 'body': getPageBody, 'date': getPageDate }
            var response = await postData('blog/create-page', body)
            if (response.status === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Page published!'
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Page not published!'
                })
            }
        }
    }

    const handleDuplicatePage = (pageTitle, pageBody, pageDate) => {
        Swal.fire({
            title: 'Duplicate',
            text: "Are you sure you want to dupicate?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0069ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, duplicate it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { 'title': `${pageTitle} - Copy`, 'body': pageBody, 'date': pageDate }
                var response = await postData('blog/create-page', body)
                fetchPages()
                Swal.fire('Page duplicated!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Page not duplicated', '', 'info')
            }
        })
    };

    const handleUpdatePage = async () => {
        Swal.fire({
            title: 'Do you want to update the page?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Update',
            denyButtonText: `Don't update`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var error = validation()
                if (error === false) {
                    var body = { '_id': getPageId, 'title': getPageTitle, 'body': getPageBody, 'date': getPageDate }
                    var response = await postData('blog/update-page', body)
                }
                fetchPages()
                Swal.fire('Page Updated!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Page not updated', '', 'info')
            }
        })
    }

    const handleDeletePage = async (getPageId) => {
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
                var body = { _id: getPageId }
                var response = await postData('blog/delete-page', body)
                fetchPages()
                Swal.fire(
                    'Deleted!',
                    'Page has been deleted.',
                    'success'
                )
            }
        })
    }

    const handleDate = (date) => {
        setPageDate(date)
    }


    const handleClose = () => {
        setOpen(false);
    }

    const closeCreatePageDialog = () => {
        setOpenCreatePageDialog(false)
    }


    const createPageDialog = () => {
        return (
            <div>
                <Dialog
                    fullScreen
                    open={openCreatePageDialog}
                    onClose={closeCreatePageDialog} >
                    <AppBar sx={{ position: 'relative', background: '#0069ff' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={closeCreatePageDialog}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                {getPageTitle}
                            </Typography>
                            <Button startIcon={<SaveIcon />} autoFocus variant='outlined' onClick={handleSubmitPage} style={{ borderColor: 'white', color: 'white', marginRight: '0.5%' }}>
                                Publish
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {createPage()}
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }



    const editPageDialog = () => {
        return (
            <div>
                <Dialog
                    fullScreen
                    open={open}
                    onClose={handleClose} >
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
                                {getPageTitle}
                            </Typography>
                            <Button startIcon={<SaveIcon />} autoFocus variant='outlined' onClick={handleUpdatePage} style={{ borderColor: 'white', color: 'white', marginRight: '0.5%' }}>
                                Update
                            </Button>
                            <Button startIcon={<DeleteIcon />} autoFocus variant='outlined' onClick={() => handleDeletePage(getPageId)} style={{ borderColor: 'white', color: 'white', marginLeft: '0.5%' }}>
                                Delete
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {editPage()}
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }


    const handleEditPageDialogOpen = (pageId, pageTitle, pageBody, pageDate) => {
        setOpen(true)
        setPageId(pageId)
        setPageTitle(pageTitle)
        setPageBody(pageBody)
        setPageDate(pageDate)
    }


    const handleOpenPageDialog = () => {
        setOpenCreatePageDialog(true)
    }

    const columns = [
        { field: 'title', headerName: 'Title', width: 1000 },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 100,
            renderCell: (params) => (
                <Button
                    startIcon={<EditIcon style={{ color: '#004cef' }} />}

                    onClick={() => handleEditPageDialogOpen(params.row._id, params.row.title, params.row.body, params.row.date)}>
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
                    onClick={() => handleDeletePage(params.row._id)}>
                </Button>
            ),
        },
        {
            field: 'duplicate',
            headerName: 'Duplicate',
            width: 150,
            renderCell: (params) => (
                <Button
                    startIcon={<ContentCopyIcon style={{ color: 'red' }} />}
                    onClick={() => handleDuplicatePage( params.row.title, params.row.body, params.row.date)}>
                </Button>
            ),
        },
    ];

    const pagesList = () => {
        return (

            <div style={{ height: 'auto', width: '90%', marginTop: '3%' }}>

                <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item xs={6}>
                        <span style={{ fontWeight: '600', fontSize: '25px' }}>Pages</span>
                    </Grid>
                    <Grid item xs={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                        <span>
                            <Fab style={{ background: '#0069ff', color: 'white' }} aria-label="add" onClick={handleOpenPageDialog}>
                                <AddIcon />
                            </Fab>
                        </span>
                    </Grid>
                </Grid>

                <DataGrid
                    style={{ padding: '1%', border: 'none', marginTop: '3%' }}
                    rows={getDatabasePages}
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


    const editPage = () => {
        return (
            <div>
                <Grid container spacing={2} style={{ padding: '3%' }}>

                    <Grid item md={12}>
                        <TextField
                            value={getPageTitle}
                            className={classes.roundedTextField}
                            error={getErrors.getPageTitle}
                            helperText={getErrors.getPageTitle}
                            onFocus={() => handleError('', 'getPageTitle')} fullWidth label='Page Title'
                            onChange={(event) => setPageTitle(event.target.value)} />
                    </Grid>

                    <Grid item md={9}>
                        <ReactQuill theme="snow" value={getPageBody} onChange={handleQuill} modules={modules} />
                    </Grid>

                    <Grid item md={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Date" onChange={handleDate} value={dayjs(getPageDate)} className={classes.roundedTextField} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>

                </Grid>
            </div>
        )
    }



    const createPage = () => {
        return (
            <div>
                <Grid container spacing={2} style={{ padding: '0 3%' }}>

                    <Grid item md={12}>
                        <TextField
                            className={classes.roundedTextField}
                            error={getErrors.getPageTitle}
                            helperText={getErrors.getPageTitle}
                            onFocus={() => handleError('', 'getPageTitle')} fullWidth label='Page Title'
                            onChange={(event) => setPageTitle(event.target.value)} />
                    </Grid>

                    <Grid item md={9}>
                        <ReactQuill theme="snow" value={getPageBody} onChange={handleQuill} modules={modules} />
                    </Grid>

                    <Grid item md={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Date" onChange={handleDate} className={classes.roundedTextField} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>

                </Grid>
            </div>
        )
    }

    return (
        <div className='root'>
            <div className='box'>
                {pagesList()}
                {editPageDialog()}
                {createPageDialog()}
            </div>
        </div >
    )

}