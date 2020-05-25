import React, { useState } from 'react'
import AddCard from '../components/AddCard'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core'

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
const useStyles = makeStyles(theme => ({

    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: '100%',
        width: '100%'
    },
    tabs: {
        '& .MuiTab-wrapper': {
            alignItems: 'flex-start',
            marginLeft: '1.5rem'
        },
        '& .MuiTabs-indicator': {
            transform: 'rotate(90deg)',
            left: 0,
            backgroundColor: '#252525'
        },
        minWidth: '200px',
        borderRight: `1px solid ${theme.palette.divider}`
    },
}));

export default function Settings() {
    const classes = useStyles()
    const [value, setValue] = useState(2)
    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
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
            <TabPanel value={value} index={0}></TabPanel>
            <TabPanel value={value} index={1}></TabPanel>
            <TabPanel value={value} index={2}>
                <AddCard />
            </TabPanel>
            <TabPanel value={value} index={3}></TabPanel>
            <TabPanel value={value} index={4}></TabPanel>
        </div>)
}