import React ,{useEffect,useState} from 'react';
import {useSelector,useDispatch} from "react-redux"


import { useNavigate, useParams } from 'react-router';
import { BrowserRouter as Router, Routes as Switch, Route, Link} from "react-router-dom";



import { styled, useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import {Button, CssBaseline, Grid, IconButton, Toolbar } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';

import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';





import { Store } from 'react-notifications-component';
import Employee from './employee.component';
import EmploymentType from './employementType.component';
import Branch from './branch.component';
import Department from './department.component';
import Designation from './designation.component';
import LeavePolicy from './leavePolicy.component';
import Attendance from './attendance.component';


const drawerWidth = 220;

const TABS = styled(Tabs)({
    marginRight:"5px",
    marginLeft:"5px",
    padding:"0px 0px 0px 10px",
    // boxShadow:"0px 0px 4px rgb(211,211,211)",
    // borderRadius:"4px",
    '& .MuiTab-root':{
        color:"#333"
    },
    '& .MuiTabs-indicator': {
        backgroundColor: '#999',
        bottom:"10px"
        
    },
    '& .Mui-selected': {
        color: '#000 !important',
    },
    '& .MuiTabs-scroller':{
        display:"flex",
        alignItems:"center"
    }
});

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: 0,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: `${drawerWidth}px`,
      }),
    }),
  );

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const HR = ({setTabOpend,tabOpend}) => {
    const theme = useTheme();
    let navigate = useNavigate()
    const [open,setOpen] = useState(false)
    const [heading,setHeading] = useState("")
    const [value, setValue] = useState(0);
    const [hrTabs,setHrtabs] = useState([])


    const handleDrawerOpen = async(toOpen)=>{
        setOpen(true)
        
    }
    const handleDrawerClose = async(text)=>{
        setOpen(true)
        navigate("/hr/"+text.replace(" ","_").toLowerCase())
        setOpen(false)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        setTabOpend("HUMAN RESOURSE")
        setHrtabs(['Employee',"Permission/Employment Type","Branch","Department","Designation","Leave Policy","Attendance"])
    }, []);
    
    // useEffect(()=>{
    //     // navigate("/hr")
    //     setValue(0)
    // },[tabOpend])
    
    return (
        <>  
                <Box sx={{display:"inital"}} >
                    {/* <CssBaseline /> */}
                    <Grid container sx={{mt:"-18px"}}>
                        <TABS
                            value={value}
                            onChange={handleChange}
                            aria-label="HR tabs"
                            scrollButtons={false}
                            variant="scrollable"
                        >
                            {hrTabs?.map((text,idx)=>{
                                if(text=="Permission/Employment Type"){
                                    return(
                                        <Tab onClick={()=>handleDrawerClose("employment_type")} style={{borderBottom:"#999",fontSize:"12px",minHeight:"24px",padding:"10px 12px"}} key={idx} value={idx} label={text}/>

                                    )
                                }else{
                                    return(
                                        <Tab onClick={()=>handleDrawerClose(text)} style={{borderBottom:"#999",fontSize:"12px",minHeight:"24px",padding:"10px 12px"}} key={idx} value={idx} label={text}/>
                                    )
                                }
                            })}
                        </TABS>
                    </Grid>
                    <Main style={{padding:"0px 5px",marginTop:"40px"}}>
                            <div className="container" style={{margin:"0",maxWidth:"1400px",position:"relative",bottom:"15px"}}>

                                <Switch>
                                    <Route exact path="/" element={<Employee setHeading={setHeading}/>} />
                                    <Route exact path="/employee" element={<Employee setHeading={setHeading}/>} />
                                    <Route exact path="/employment_type" element={<EmploymentType setHeading={setHeading}/>} />
                                    <Route exact path="/branch" element={<Branch setHeading={setHeading}/>} />
                                    <Route exact path="/department" element={<Department setHeading={setHeading} />} />
                                    <Route exact path="/designation" element={<Designation setHeading={setHeading} />} />
                                    <Route exact path="/leave_policy" element={<LeavePolicy setHeading={setHeading} />} />
                                    <Route exact path="/attendance" element={<Attendance setHeading={setHeading} />} />
                                </Switch>

                            </div>
                    </Main>

                </Box>

        </>
    );
}

export default HR;
