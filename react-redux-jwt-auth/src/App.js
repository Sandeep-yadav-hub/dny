import React, {useState,useEffect } from "react";
import {useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes as Switch, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import Todo from "./components/todo.component";
import Navbar from "./components/navbar.component";


const App = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(state=>state.auth)
  const [showModeratorBoard,setShowModeratorBoard] = useState(false)
  const [showAdminBoard,setShowAdminBoard] = useState(false)
  const [currentUser,setCurrentUser] = useState(undefined)

  function logOut() {
    dispatch(logout());
  }
  
 
  useEffect(() => {
    if (user) {
      setCurrentUser(user)
      setShowModeratorBoard(user?.roles?.includes("ROLE_MODERATOR"))
      setShowAdminBoard(user?.roles?.includes("ROLE_ADMIN"))
    }
    return () => {
      setCurrentUser(undefined)
      setShowModeratorBoard(false)
      setShowAdminBoard(false)
    };
  }, [user]);

  return (
        <Navbar />
    // <Router>
    //   <div>
    //     <nav className="navbar navbar-expand navbar-dark bg-dark">
    //       <Link to={"/"} className="navbar-brand">
    //         bezKoder
    //       </Link>
    //       <div className="navbar-nav mr-auto">
    //         <li className="nav-item">
    //           <Link to={"/home"} className="nav-link">
    //             Home
    //           </Link>
    //         </li>
    //         {showModeratorBoard && (
    //           <li className="nav-item">
    //             <Link to={"/mod"} className="nav-link">
    //               Moderator Board
    //             </Link>
    //           </li>
    //         )}
    //         {showAdminBoard && (
    //           <li className="nav-item">
    //             <Link to={"/admin"} className="nav-link">
    //               Admin Board
    //             </Link>
    //           </li>
    //         )}
    //         {currentUser && (
    //           <li className="nav-item">
    //             <Link to={"/user"} className="nav-link">
    //               User
    //             </Link>
    //           </li>
    //         )}
    //       </div>
    //       {currentUser ? (
    //         <div className="navbar-nav ml-auto">
    //           <li className="nav-item">
    //             <Link to={"/profile"} className="nav-link">
    //               {currentUser.username}
    //             </Link>
    //           </li>
    //           <li className="nav-item">
    //             <Link to={"/todo"} className="nav-link">
    //               Todo
    //             </Link>
    //           </li>
    //           <li className="nav-item">
    //             <a href="/login" className="nav-link" onClick={logOut}>
    //               LogOut
    //             </a>
    //           </li>
    //         </div>
    //       ) : (
    //         <div className="navbar-nav ml-auto">
    //           <li className="nav-item">
    //             <Link to={"/login"} className="nav-link">
    //               Login
    //             </Link>
    //           </li>
    //           <li className="nav-item">
    //             <Link to={"/register"} className="nav-link">
    //               Sign Up
    //             </Link>
    //           </li>
    //         </div>
    //       )}
    //     </nav>
    //     <div className="container mt-3">
    //       <Switch>
    //         <Route exact path="/home" element={<Home/>} />
    //         <Route exact path="/login" element={<Login/>} />
    //         <Route exact path="/register" element={<Register/>} />
    //         <Route exact path="/profile" element={<Profile/>} />
    //         <Route exact path="/todo" element={<Todo/>} />
    //         <Route path="/user" element={<BoardUser/>} />
    //       </Switch>
    //     </div>
    //   </div>
    // </Router>
  );
}

export default App;

