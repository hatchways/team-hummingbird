import React, { useState, useEffect } from 'react'

import {
    Typography,
    Container,
    Box,
    Grid,
    GridList,
    GridListTile,
    makeStyles,
    Avatar,
    Button,
    Tab,
    Tabs,
    useMediaQuery
} from '@material-ui/core'
import { useAuth } from "../components/UserContext";


export default function ContestSubmissions(props) {
    const { authTokens } = useAuth();
    const [user] = useState(authTokens ? authTokens.user : null);

    const isMobile = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const [submissions] = useState(imageGridList)
    const classes = useStyles()
    const [activeTab, setActiveTab] = useState(0)

    React.useEffect(()=>{
        console.log(props)
        console.log(authTokens)
    }, [user])
    return (
        <Container>
            <Box size="large" className={classes.breadcrumbWrapper}>
                <Typography variant="caption" className={classes.breadcrumb}>Back to contents list</Typography>
            </Box>

            <Grid
                container>
                <Grid container direction="column" item sm={8} justifyContent="center">
                    <div className={classes.titleWrapper}>
                        <Typography variant="h4">Contest Title </Typography>
                        <span className={classes.price}>$150</span>
                    </div>
                    <Grid
                        item
                        container
                        spacing={2}
                        alignItems="center"
                    >
                        <Grid item>
                            <Avatar alt="user profile image"
                                src={user?.profile_image_url || "https://hatchways-hummingbird.s3.amazonaws.com/1590245137718image-2.png"} />
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">By {user?.name || "Placeholder Paul"}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} sm={4} justify="center">
                    <Button
                        size="large"
                        className={classes.submitButton}
                        variant="outlined"
                    >Submit A Design</Button>
                </Grid>
            </Grid>
            <Tabs
                variant="fullWidth"
                value={activeTab}
                onChange={(e, index) => setActiveTab(index)}
                className={classes.tabs}
            >
                <Tab label="DESIGNS" />
                <Tab label="BRIEFS" />
            </Tabs>
            <TabPanel className={classes.tabPanel} value={activeTab} index={0}>
                <GridList
                    cellHeight={isMobile ? 300 : 180}
                    className={classes.gridList}
                    cols={isMobile ? 1 : 4}
                    spacing={10}
                >
                    {submissions.map((submission, index) => (
                        <GridListTile key={index} cols={1}>
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `url(${submission.imageURL})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography style={{
                                    color: 'white',
                                    alignSelf: 'flex-end',
                                    fontWeight: 'bold',
                                    textShadow: '0px 0px 3px black'
                                }}>By @<span style={{ textDecoration: 'underline' }}>{submission?.user_name || 'artist'}</span></Typography>
                            </div>
                        </GridListTile>
                    ))}
                </GridList>
            </TabPanel>
            <TabPanel className={classes.tabPanel} value={activeTab} index={1}><p>briefs</p></TabPanel>


        </Container>)
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            hidden={value !== index}
            id={`vertical-tab-panel-${index}`}
            {...other}>
            {value === index && (
                <Box width="100%">
                    {children}
                </Box>
            )}
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    breadcrumbWrapper: {
        marginTop: '1rem',
        marginBottom: '1rem'
    },
    breadcrumb: {
        color: 'gray',
        textDecoration: 'underline',
    },
    titleWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem'
    },
    price: {
        backgroundColor: 'black',
        color: 'white',
        padding: '6px',
        fontSize: '10px',
        fontWeight: 'bold',
        marginLeft: '0.5rem'
    },
    submitButton: {
        borderRadius: 0,
        borderColor: 'black',
        maxHeight: 50
    },
    tabs: {
        '& .MuiTabs-indicator': {
            backgroundColor: '#252525',
        }
    }
}))
//placeholders
const imageGridList = [
    { id: 1, imageURL: "https://i.imgur.com/HFJL0eq.png" },
    { id: 2, imageURL: "https://i.imgur.com/Nf8SsCu.png" },
    { id: 3, imageURL: "https://i.imgur.com/GiwnXsg.png" },
    { id: 4, imageURL: "https://i.imgur.com/ihBkO9i.png" },
    { id: 5, imageURL: "https://i.imgur.com/mFs0fVv.png" },
    { id: 6, imageURL: "https://i.imgur.com/YJYmGtD.png" },
    { id: 7, imageURL: "https://i.imgur.com/AtGXbpx.png" },
    { id: 8, imageURL: "https://i.imgur.com/hxhWXk9.png" },
    { id: 9, imageURL: "https://i.imgur.com/02iEupb.png" },
    { id: 10, imageURL: "https://i.imgur.com/u6v65NG.png" },
    { id: 11, imageURL: "https://i.imgur.com/C4atyQX.png" },
    { id: 12, imageURL: "https://i.imgur.com/Gh4Nrxo.png" },
];