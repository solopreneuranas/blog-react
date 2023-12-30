import '../App.css';
import { Grid, TextField, Button, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import { postData } from '../Services/FetchNodeServices';
import Swal from 'sweetalert2'
import ImageIcon from '@mui/icons-material/Image';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function CreateCategory() {
    const classes = useStyles()

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
                                <ImageIcon style={{ width: 100, height: 100 }} />
                            </Avatar>
                        </Button>
                    </Grid>
                    <Grid item md={12} className='center'>
                        <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', padding: 0 }}>{getErrors.getCategoryPoster}</p>
                    </Grid>

                    <Grid item md={12}>
                        <TextField
                            className={classes.roundedTextField}
                            error={getErrors.getCategoryName}
                            helperText={getErrors.getCategoryName}
                            onFocus={() => handleError('', 'getCategoryName')} fullWidth label='Category Name'
                            onChange={(event) => setCategoryName(event.target.value)} />
                    </Grid>

                    <Grid item md={12} className='right'>
                        <Button startIcon={<AddCircleOutlineIcon />} style={{
                            borderColor: '#0069ff',
                            color: '#0069ff',
                            padding: '2% 4%'
                        }}
                            onClick={handleSubmitCategory} variant='outlined'>Add</Button>
                    </Grid>
                </Grid>
            </div>

        </div >
    )

}