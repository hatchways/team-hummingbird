import React, { useState } from 'react'
import AddCard from '../components/AddCard'
import {
    Tab,
    Tabs,
    Box,
    makeStyles,
    Container,
    useMediaQuery
} from '@material-ui/core'


function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            hidden={value !== index}
            id={`vertical-tab-panel-${index}`}
            {...other}>
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function Settings(props) {
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const { user } = props
    const classes = useStyles()
    const [value, setValue] = useState(2) //defaults to payment details for
    return (
        <Container className={classes.root}>
            <Tabs
                orientation={isMobile ? "horizontal" : "vertical"}
                variant="scrollable"
                value={value}
                onChange={(e, newValue) => setValue(newValue)}
                className={classes.tabs}
            >
                <Tab label="Profile" />
                <Tab label="Personal Information" />
                <Tab label="Payment Details" />
                <Tab label="Notifications" />
                <Tab label="Password" />
            </Tabs>
            <TabPanel className={classes.tabPanel} value={value} index={0}></TabPanel>
            <TabPanel className={classes.tabPanel} value={value} index={1}></TabPanel>
            <TabPanel className={classes.tabPanel} value={value} index={2}>
                <AddCard />
            </TabPanel>
            <TabPanel className={classes.tabPanel} value={value} index={3}></TabPanel>
            <TabPanel className={classes.tabPanel} value={value} index={4}></TabPanel>
        </Container>)
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: '100%',
        width: '100%',
        [theme.breakpoints.down("xs")]: {
            flexDirection: 'column'
        }
    },
    tabPanel: {
        display: 'flex',
        flexGrow: 1,
        width: '100%',
        justifyContent: 'center',
    },
    tabs: {
        '& .Mui-selected .MuiTab-wrapper': {
            fontWeight: 'bold',
            color: 'black',
        },
        '& .MuiTab-wrapper': {
            alignItems: 'flex-start',
            color: 'gray',
            [theme.breakpoints.up("sm")]: {
                marginLeft: '1.5rem',
            }
        },
        '& .MuiTabs-indicator': {
            left: 0,
            backgroundColor: '#252525',
            width: '1px',
            [theme.breakpoints.up("sm")]: {
                transform: 'rotate(90deg)',
            }
        },
        minWidth: '200px',
    },
}));