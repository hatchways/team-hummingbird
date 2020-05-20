import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'

import {
    Grid,
    Button,
    Typography,
} from '@material-ui/core'
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';


export default function SubmitSubmission(props) {
    const [document, setDocument] = useState()
    const classes = useStyles()

    //get userID from future state manager
    const user = props.user

    const handleSubmit = () => {
        if (document) {
            console.log(document)
            alert('sending ' + document)

            //Todo: Send to backend route axios.put('/contest/${user.id}/submission', document)
            //.then( response OK )
        } else {
            alert('Select a file first')
        }
    }
    React.useEffect(() => {
        if (document) {
            console.log('selected ' + document)
        }
    }, [document])
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
                    <Typography className={classes.title} variant="h4">Submit Your Design</Typography>
                    <div>
                        <input
                            accept="image/*" //jpg, gif, png
                            onChange={e => setDocument(e.target.value)}
                            className={classes.uploadButton}
                            id="uploader"
                            multiple
                            type="file"
                        />
                        <label htmlFor="uploader" >
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
    submitButton: {
        backgroundColor: '#252525',
        color: 'white',
        borderRadius: 0,
        padding: theme.spacing(2),
        minWidth: '200px'
    },
}))