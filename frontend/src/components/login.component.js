import React, { Component ,useEffect,useState} from "react";
import { Navigate ,useLocation, useNavigate} from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {useSelector,useDispatch } from "react-redux";
import { login } from "../actions/auth";
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

const Login = ({setTabOpend}) => {
    let history = useLocation()
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState("")
    const [form,setForm] = useState(null)
    const [checkBtn,setCheckBtn] = useState(null)
    const message = useSelector(state=>state.message?state.message:"")
    const from = history.state?.from?.pathname || "/";
    const {isLoggedIn} = useSelector(state=>state.auth)
    function onChangeUsername(e){
        setUsername(e.target.value)
    }
    function onChangePassword(e){
        setPassword(e.target.value)
    }
    function handleLogin(e){
        e.preventDefault();
        setLoading(true)
        form.validateAll();
        if (checkBtn?.context._errors.length === 0) {
            dispatch(login(username,password))
                .then(() => {
                    navigate(from, { replace: true });
                    // window.location.reload();
                })
                .catch(() => {
                    setLoading(false)
                });
        } else {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log(message)
        setTabOpend("LOGIN")
    }, []);

    if (isLoggedIn) {
        return (<Navigate to="/profile" />);


    }else {
        return(
            <div className="col-md-12">
                <div className="card card-container">
                <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card"
                />
                <Form
                    onSubmit={handleLogin}
                    ref={(c) => {
                        setForm(c);
                    }}
                >
                    <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <Input
                        type="text"
                        className="form-control"
                        name="username"
                        value={username}
                        onChange={onChangeUsername}
                        validations={[required]}
                    />
                    </div>
                    <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Input
                        type="password"
                        className="form-control"
                        name="password"
                        value={password}
                        onChange={onChangePassword}
                        validations={[required]}
                    />
                    </div>
                    <div className="form-group">
                    <button
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                        )}
                        <span>Login</span>
                    </button>
                    </div>
                    {message && !isEmpty(message) && (
                    <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                        {message}
                        </div>
                    </div>
                    )}
                    <CheckButton
                    style={{ display: "none" }}
                    ref={(c) => {
                        setCheckBtn(c);
                    }}
                    />
                </Form>
                </div>
            </div>

        )
    };
}

export default Login;

