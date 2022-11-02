import React, { Component,useEffect,useState } from "react";
import { Navigate } from 'react-router-dom';
import { connect,useSelector } from "react-redux";


const Profile = ({setTabOpend}) => {
    const user = useSelector(state=>state.auth.user?state.auth.user:undefined)
    useEffect(()=>{
      console.log(user)
      setTabOpend("PROFILE")
    },[])

      if (!user?.id) {
        return <Navigate to="/login" />;
      }
      return (
        <div className="container">
          <header className="jumbotron">
            <h3>
              <strong>{user?.username}</strong> Profile
            </h3>
          </header>
          <p>
            <strong>Token:</strong> {user?.accessToken.substring(0, 20)} ...{" "}
            {user?.accessToken}
            {/* {user?.accessToken.substr(user?.accessToken.length - 20)} */}

          </p>
          <p>
            <strong>Id:</strong> {user?.id}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <strong>Authorities:</strong>
          <ul>
            {user?.roles &&
              user?.roles.map((role, index) => <li key={index}>{role}</li>)}
          </ul>
        </div>
      );
}

export default Profile;


