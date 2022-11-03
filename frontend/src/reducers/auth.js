import dayjs from "dayjs";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
  } from "../actions/type";
  const user = JSON.parse(localStorage.getItem("user"));

  function getInitialState(){
    if(!user){
      return { isLoggedIn: false, user: null }
    }
    var expired = dayjs(`${user.expires.date} ${user.expires.time}`).isBefore(dayjs())
    if(expired){
      localStorage.removeItem("user");
      return { isLoggedIn: false, user: null }

    }
    return { isLoggedIn: true, user }
  }

  const initialState = getInitialState()
  export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
      case REGISTER_SUCCESS:
        return {
          ...state,
          isLoggedIn: false,
        };
      case REGISTER_FAIL:
        return {
          ...state,
          isLoggedIn: false,
        };
      case LOGIN_SUCCESS:
        return {
          ...state,
          isLoggedIn: true,
          user: payload.user,
        };
      case LOGIN_FAIL:
        return {
          ...state,
          isLoggedIn: false,
          user: null,
        };
      case LOGOUT:
        return {
          ...state,
          isLoggedIn: false,
          user: null,
        };
      default:
        return state;
    }
  }
  