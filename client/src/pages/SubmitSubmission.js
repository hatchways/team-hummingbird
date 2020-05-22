import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'

import {
    Grid,
    Button,
    Typography,
    Snackbar,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';

import S3 from 'react-s3-uploader'
import axios from 'axios'

export default function SubmitSubmission(props) {
    const [uploadedFiles, setUploadedFiles] = useState([])
    const classes = useStyles()
    //Snackbar state
    const [openAlert, setOpenAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("WARNING")
    const [severity, setSeverity] = useState("error") //allowed: error, warning, success, info

    //get userID from future state manager
    const user_id = props.user_id
    const contest_id = props.contest_id

    const handleSubmit = () => {
        if (uploadedFiles.length > 0) {
            const submission = {
                contest_id,
                user_id,
                upload_files: {
                    uploadedFiles
                }
            }
            axios.put(`/contest/:id`, { submission })
                .then(res => {
                    handleAlert('Uploaded Successfully', 'success')
                    setUploadedFiles([])
                })
                .catch(e => {
                    handleAlert('There was a problem submitting your file, please try again.', 'error')
                })
        } else {
            handleAlert('Select a file first', 'error')
        }
    }

    const handleAlert = (message, severity) => {
        setOpenAlert(true)
        setSeverity(severity)
        setAlertMessage(message)
    }

    return (
        <div className={classes.container}>
            <Grid
                style={{ flex: 1, height: '80%' }}
                container
                spacing={2}
                justify="center"
                align="center">
                <Grid item className={classes.uploadBox}
                >
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        open={openAlert}
                        autoHideDuration={5000}
                        onClose={() => setOpenAlert(false)}
                    >
                        <Alert
                            severity={severity}
                            onClose={() => setOpenAlert(false)}
                        >
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                    <Typography className={classes.title} variant="h4">Submit Your Design</Typography>
                    <div>
                        <S3
                            accept="image/*"
                            signingUrl="/s3/sign"
                            signingUrlWithCredentials={true}
                            className={classes.uploadButton}
                            id="s3"
                            onFinish={e => {
                                const url = e["uploadUrl"]
                                setUploadedFiles([...uploadedFiles, url])
                            }} />
                        <label htmlFor="s3" >
                            <Button
                                component="span"
                            >
                                <CloudUploadOutlinedIcon
                                    fontSize="large" />

                            </Button>
                        </label>
                        <div style={{ margin: '2rem' }}>
                            <Typography
                                style={{ fontWeight: 'bolder' }}
                                variant="body1">Click to choose a file</Typography>
                            <br />
                            <Typography
                                display="block"
                                style={{ color: 'gray', fontWeight: 'lighter' }}
                                variant="caption">High resolution images</Typography>
                            <Typography
                                display="block"
                                style={{ color: 'grey', fontWeight: 'lighter' }}
                                variant="caption">PNG, JPG, GIF</Typography>
                        </div>
                        {uploadedFiles.length > 0 ? <>{uploadedFiles.map(file => {
                            return (
                                <img
                                    key={file}
                                    className={classes.preview}
                                    src={file} />)
                        })}</> : null}

                    </div>

                    <Button
                        size="large"
                        className={classes.submitButton}
                        onClick={handleSubmit}
                        variant="outlined">Submit</Button>

                </Grid>

            </Grid>
        </div>

    )
}
//theme components styled with useStyles, local components use inline styles
const useStyles = makeStyles(theme => ({
    container: {
        flexGrow: 1,
        height: '100vh',
        display: 'flex',
        alignItems: 'center'
    },
    uploadBox: {
        display: 'flex',
        flex: 1,
        height: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'column',
        padding: theme.spacing(2)
    },
    title: {
        fontWeight: 'bold'
    },
    uploadButton: {
        display: 'none',
    },
    preview: {
        height: '75px',
        width: '75px'
    },
    submitButton: {
        backgroundColor: '#252525',
        color: 'white',
        borderRadius: 0,
        padding: theme.spacing(2),
        minWidth: '200px'
    },
}))