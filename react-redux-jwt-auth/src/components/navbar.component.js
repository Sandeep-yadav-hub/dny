import React,{useState,useEffect} from 'react';
import {useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes as Switch, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

// Components
import Login from "./login.component";
import Register from "./register.component";
import Home from "./home.component";
import Profile from "./profile.component";
import BoardUser from "./board-user.component";
import { logout } from "../actions/auth";
import { clearMessage } from "../actions/message";
import Todo from "./todo.component";
import Chat from './chat.component';
import Calender from "./calender/calender.component"
// import Notification from "./notificaion.component"

import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
// import Navbar from "./navbar.component";

// Material Ui imports
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Icons
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import ChatIcon from '@mui/icons-material/Chat';
import Meeting from './meeting/meeting.component';
import HR from './HR/hr.component';
import RequireAuth from './protector';
import OrganisationChart from './organisationChart/organisationChart.component';
import Payslip from './payslip/payslip.component';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
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



const Navbar = () =>{
  const theme = useTheme();
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  const {user,isLoggedIn} = useSelector(state=>state.auth)
  const [showModeratorBoard,setShowModeratorBoard] = useState(false)
  const [showAdminBoard,setShowAdminBoard] = useState(false)
  const [currentUser,setCurrentUser] = useState(undefined)
  const [tabOpend,setTabOpend] = useState("")

  function logOut() {
    dispatch(logout());
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const camelCase = (str)=>{
    // converting all characters to lowercase
        var ans = str.toLowerCase();
     
    // Returning string to camelcase
        return ans.split(" ").reduce((s,c)=> s + (c.charAt(0).toUpperCase()+ c.slice(1) ));
  
  }


  useEffect(() => {
    if (user) {
      setCurrentUser(user)
      setShowModeratorBoard(user?.roles?.includes("ROLE_MODERATOR"))
      setShowAdminBoard(user?.roles?.includes(3))
    }
    return () => {
      setCurrentUser(undefined)
      setShowModeratorBoard(false)
      setShowAdminBoard(false)
    };
  }, [user]);

  return (
    <Router>
        <ReactNotifications />
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" open={open} sx={{ bgcolor: "#212529" }}>
              <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(open && { display: 'none' }) }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    {tabOpend}
                </Typography>
              </Toolbar>
          </AppBar>
          {/* <Notification /> */}
          <Drawer
              sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
              },
              }}
              variant="persistent"
              anchor="left"
              open={open}
          >
              <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </DrawerHeader>
              <Divider />
              <List>
              {['Home',"Todo","User","Calender","Chat","Meeting","HR","Organization","Payslip"].map((text, index) => {
                  if ((text=="Chat" || text=="Meeting" || text=="Todo" || text == "HR" || text == "User" || text == "Calender" || text == "Organization")  && !isLoggedIn){
                    return 
                  }else{
                    // for adminHR,HR Employee
                    if(text == "HR" && (isLoggedIn && currentUser && currentUser.roles.find(role => [1,3,4].includes(role)))){
                      return(
                        <Link key={index} to={"/"+text.toLowerCase()} style={{textDecoration:"none",color:"#000"}}>
                          <ListItem key={text} disablePadding>
                              <ListItemButton>
                                  <ListItemIcon>
                                  #
                                  {}
                                  </ListItemIcon>
                                  <ListItemText primary={text} />
                              </ListItemButton>
                          </ListItem>
                      </Link>
                      )
                    }else{
                      if (text!=="HR"){
                        // for all Employees
                        if((text=="Chat" || text=="Meeting" || text=="Todo" || text == "User" || text == "Calender" || text == "Organization"  ) && (isLoggedIn && currentUser && currentUser.roles.find(role => [7].includes(role)))){
                          return(
                            <Link key={index} to={"/"+text.toLowerCase()} style={{textDecoration:"none",color:"#000"}}>
                              <ListItem key={text} disablePadding>
                                  <ListItemButton>
                                      <ListItemIcon>
                                      {text.toLowerCase() === 'home' ? <HomeOutlinedIcon /> : (text.toLowerCase() === 'chat' ? <ChatIcon /> : (text.toLowerCase() === 'todo' ? <ListAltOutlinedIcon /> : (text.toLowerCase() === 'user' ? <AccountCircleOutlinedIcon /> : (text.toLowerCase()) == "calender"?(
                                        <svg style={{marginLeft:"3px"}} width="19" height="21" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 9H4V11H6V9ZM10 9H8V11H10V9ZM14 9H12V11H14V9ZM16 2H15V0H13V2H5V0H3V2H2C0.89 2 0 2.9 0 4V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V4C18 3.46957 17.7893 2.96086 17.4142 2.58579C17.0391 2.21071 16.5304 2 16 2ZM16 18H2V7H16V18Z" fill="#707070"/>
                                        </svg>
                                      ) : ("#")))) }
                                      {}
                                      </ListItemIcon>
                                      <ListItemText primary={text} />
                                  </ListItemButton>
                              </ListItem>
                            </Link>
                          )
                        }else{
                          return(
                            <Link key={index} to={"/"+text.toLowerCase()} style={{textDecoration:"none",color:"#000"}}>
                              <ListItem key={text} disablePadding>
                                  <ListItemButton>
                                      <ListItemIcon>
                                      {text.toLowerCase() === 'home' ? <HomeOutlinedIcon /> : (text.toLowerCase() === 'chat' ? <ChatIcon /> : (text.toLowerCase() === 'todo' ? <ListAltOutlinedIcon /> : (text.toLowerCase() === 'user' ? <AccountCircleOutlinedIcon /> : (text.toLowerCase()) == "calender"?(
                                        <svg style={{marginLeft:"3px"}} width="19" height="21" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 9H4V11H6V9ZM10 9H8V11H10V9ZM14 9H12V11H14V9ZM16 2H15V0H13V2H5V0H3V2H2C0.89 2 0 2.9 0 4V18C0 18.5304 0.210714 19.0391 0.585786 19.4142C0.960859 19.7893 1.46957 20 2 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V4C18 3.46957 17.7893 2.96086 17.4142 2.58579C17.0391 2.21071 16.5304 2 16 2ZM16 18H2V7H16V18Z" fill="#707070"/>
                                        </svg>
                                      ) : ("#")))) }
                                      {}
                                      </ListItemIcon>
                                      <ListItemText primary={text} />
                                  </ListItemButton>
                              </ListItem>
                            </Link>
                          )
                        }
                        
                      }
                    }
                  }
              })}
              </List>
              <Divider />
              <List>
                  {(isLoggedIn && currentUser)&& (
                      <Link to="/profile" style={{textDecoration:"none",color:"#000"}}>
                          <ListItemButton>
                              <ListItemIcon>
                                <AccountCircleOutlinedIcon />
                                {}
                              </ListItemIcon>
                              <ListItemText primary={camelCase(currentUser.username)} />
                          </ListItemButton>
                      </Link>
                  )}
                  {(!isLoggedIn)?(
                    ["Login","Register"].map((text,index)=>{
                      return(
                        <Link key={index} to={"/"+text.toLowerCase()} style={{textDecoration:"none",color:"#000"}}>
                          <ListItemButton>
                              <ListItemIcon>
                                  #
                              </ListItemIcon>
                              <ListItemText primary={text} />
                          </ListItemButton>
                      </Link>
                      )
                    })
                  ):(
                    <Link onClick={logOut} to="" style={{textDecoration:"none",color:"#000"}}>
                        <ListItemButton>
                            <ListItemIcon>
                                #
                            </ListItemIcon>
                            <ListItemText primary={"Logout"} />
                        </ListItemButton>
                    </Link>
                  )}
                  
              </List>
          </Drawer>
          <Main open={open}>
                <DrawerHeader />
                <div className="container mtn" style={{margin:"0",maxWidth:"1400px"}}>
                  <Switch>
                      <Route exact path="/home" element={<Home setTabOpend={setTabOpend}/>} />
                      <Route exact path="/login" element={<Login setTabOpend={setTabOpend}/>} />
                      <Route exact path="/register" element={<Register setTabOpend={setTabOpend}/>} />


                      {/* Employees Ristricted Route */}
                      <Route element={<RequireAuth allowedRoles={[7]} />}>
                        <Route exact path="/todo" element={<Todo setTabOpend={setTabOpend}/>} />
                        <Route exact path="/profile" element={<Profile setTabOpend={setTabOpend}/>} />
                        <Route path="/user" element={<BoardUser setTabOpend={setTabOpend}/>} />
                        <Route path="/chat" element={<Chat setTabOpend={setTabOpend}/>} />
                        <Route path="/meeting/*" element={<Meeting setTabOpend={setTabOpend}/>} />
                        <Route path="/calender" element={<Calender setTabOpend={setTabOpend}/>} />
                        <Route path="/organization" element={<OrganisationChart setTabOpend={setTabOpend}/>} />
                        <Route path="/payslip" element={<Payslip setTabOpend={setTabOpend}/>} />
                        
                      </Route>

                      {/* HR Ristricted Route */}
                      <Route element={<RequireAuth allowedRoles={[1,3,4]} />}>
                        <Route path="/hr/*" element={<HR setTabOpend={setTabOpend} tabOpend={tabOpend} />} />
                        {/* <Route path="/" element={<Home />} /> */}
                      </Route>

                  </Switch>
                </div>
          </Main>
        </Box>
    </Router>
  );
}


export default Navbar;
