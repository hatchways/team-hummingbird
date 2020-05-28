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
    useMediaQuery,
    Paper
} from '@material-ui/core'
import { useAuth } from "../components/UserContext";
import { Link } from 'react-router-dom'

export default function ContestSubmissions(props) {
    const { authTokens } = useAuth();
    const [user] = useState(authTokens ? authTokens.user : null);

    const isMobile = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const [submissions, setSubmissions] = useState(imageGridList)
    const classes = useStyles()
    const [activeTab, setActiveTab] = useState(0)
    const contestId = props.match.params.id
    const [contestInfo, setContestInfo] = useState({
        creation_date: "",
        deadline_date: "",
        description: "",
        prize_amount: 0,
        title: "",
        user_id: "",
        _id: contestId
    })
    useEffect(() => {
        //get submissions matching contests under my id
        //separate views for contest creators and submitters
        const getInfo = async () => {
            const contestInfo = await fetch(`/api/contest/${contestId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": authTokens.token
                },
            })
            let jsonContestInfo = await contestInfo.json()
            setContestInfo(jsonContestInfo.contest)

            const submissionInfo = await fetch(`/api/contest/${contestId}/submissions`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": authTokens.token
                },
            })
            let submissionInfoJson = await submissionInfo.json()
            setSubmissions(submissionInfoJson)
        }
        getInfo()
        console.log(props)
        //console.log(authTokens)
    }, [user])
    return (
        <Container>
            <Box size="large" className={classes.breadcrumbWrapper}>
                <Link to="/profile">
                    <Typography variant="caption" className={classes.breadcrumb}>Back to profile</Typography>
                </Link>
            </Box>

            <Grid
                container>
                <Grid container direction="column" item sm={8} justifyContent="center">
                    <div className={classes.titleWrapper}>
                        <Typography variant="h4">{contestInfo.title}</Typography>
                        <span className={classes.price}>${contestInfo.prize_amount}</span>
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
                    <Link style={{ textDecoration: 'none' }} to={`/submit/${contestId}`}>
                        <Button
                            size="large"
                            className={classes.submitButton}
                            variant="outlined"
                        >Submit A Design</Button></Link>
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
                    spacing={2}
                >
                    {submissions.map((submission, index) => (
                        <GridListTile key={index} cols={1}>
                            <div
                                style={{
                                    margin: '5px',
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `url(${submission.upload_files[0]})`,
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
                                }}>By @<span style={{ textDecoration: 'underline' }}>{submission?.userId || 'artist'}</span></Typography>
                            </div>
                        </GridListTile>
                    ))}
                </GridList>
            </TabPanel>
            <TabPanel className={classes.tabPanel} value={activeTab} index={1}>

                <Paper style={{ minHeight: '300px' }}>
                    <Typography variant="caption">
                        {contestInfo.description}
                    </Typography>
                </Paper>

            </TabPanel>


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
        marginTop: '2rem',
        marginBottom: '2rem'
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

//placeholder
const imageGridList = [{
    active: true,
    contest_id: "",
    creation_date: "",
    upload_files: ["https://i.imgur.com/HFJL0eq.png"],
    user_id: ""
}]