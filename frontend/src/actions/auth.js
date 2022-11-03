import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
  } from "./type";
  import AuthService from "../services/auth.service";
import dayjs from "dayjs";
  export const register = (username, email, password) => (dispatch) => {
    return AuthService.register(username, email, password).then(
      (response) => {
        dispatch({
          type: REGISTER_SUCCESS,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: response.data.message,
        });
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch({
          type: REGISTER_FAIL,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        return Promise.reject();
      }
    );
  };
  export const login = (username, password) => (dispatch) => {
    return AuthService.login(username, password).then(
      (data) => {
        var expires = {
          date:dayjs().format("YYYY-MM-DD"),
          time:dayjs().add(8,"hour").format("HH:mm")
        }
        if (data.accessToken) {
          localStorage.setItem("user", JSON.stringify({...data,expires}));
        }
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: {...data,expires} },
        });
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch({
          type: LOGIN_FAIL,
        });
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
        return Promise.reject();
      }
    );
  };
  export const logout = () => (dispatch) => {
    AuthService.logout();
    dispatch({
      type: LOGOUT,
    });
  };
  