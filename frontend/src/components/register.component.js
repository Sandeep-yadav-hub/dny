import React, { useEffect,useState } from "react";
import {Navigate} from "react-router-dom"
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { useSelector,useDispatch } from "react-redux";
import { register } from "../actions/auth";
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
const vEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};
const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};
const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}


const Register = ({setTabOpend}) => {
  const dispatch = useDispatch()

  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const[password,setPassword]=useState("")
  const [checkBtn,setCheckBtn]=useState(null)
  const [form,setForm]=useState(null)
  const [successful,setSuccessful] = useState(false)
  const message = useSelector(state=>state.message)
  const {isLoggedIn} = useSelector(state=>state.auth)
  
  function onChangeEmail(e){
    setEmail(e.target.value)
  }
  function onChangeUsername(e){
    setUsername(e.target.value)
  }
  function onChangePassword(e){
    setPassword(e.target.value)
  }
  function handleRegister(e){
    e.preventDefault()
    setSuccessful(false)
    form.validateAll()
    if(checkBtn.context._errors.length===0){
      dispatch(register(username,email,password)).then(()=>{
        setSuccessful(true)
        window.location.href = "/profile"
      }).catch(()=>{
        setSuccessful(false)
      })
    }
  }
  useEffect(() => {
    setTabOpend("REGISTER")
  }, []);

  if (isLoggedIn) {
    return (<Navigate to="/profile" />);
  }else{
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
          <Form
            onSubmit={handleRegister}
            ref={(c) => {
              setForm(c);
            }}
          >
              <div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={username}
                    onChange={onChangeUsername}
                    validations={[required, vusername]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={onChangeEmail}
                    validations={[required, vEmail]}
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
                    validations={[required, vpassword]}
                  />
                </div>
                <div className="form-group">
                  <button className="btn btn-primary btn-block">Sign Up</button>
                </div>
              </div>
            {/* {message&&(
              <div className="form-group">
                <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                  {message}
                </div>
              </div>
            )} */}
            <CheckButton
              style={{ display: "none" }}
              ref={(c) => {
                setCheckBtn(c);
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}

export default Register;



// class Register extends Component {
//   constructor(props) {
//     super(props);
//     this.handleRegister = this.handleRegister.bind(this);
//     this.onChangeUsername = this.onChangeUsername.bind(this);
//     this.onChangeEmail = this.onChangeEmail.bind(this);
//     this.onChangePassword = this.onChangePassword.bind(this);
//     this.state = {
//       username: "",
//       email: "",
//       password: "",
//       successful: false,
//     };
//   }
//   onChangeUsername(e) {
//     this.setState({
//       username: e.target.value,
//     });
//   }
//   onChangeEmail(e) {
//     this.setState({
//       email: e.target.value,
//     });
//   }
//   onChangePassword(e) {
//     this.setState({
//       password: e.target.value,
//     });
//   }
//   handleRegister(e) {
//     e.preventDefault();
//     this.setState({
//       successful: false,
//     });
//     this.form.validateAll();
//     if (this.checkBtn.context._errors.length === 0) {
//       this.props
//         .dispatch(
//           register(this.state.username, this.state.email, this.state.password)
//         )
//         .then(() => {
//           this.setState({
//             successful: true,
//           });
//         })
//         .catch(() => {
//           this.setState({
//             successful: false,
//           });
//         });
//     }
//   }
//   render() {
//     const { message } = this.props;
//     return (
//       <div className="col-md-12">
//         <div className="card card-container">
//           <img
//             src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
//             alt="profile-img"
//             className="profile-img-card"
//           />
//           <Form
//             onSubmit={handleRegister}
//             ref={(c) => {
//               setForm(c);
//             }}
//           >
//             {successful && (
//               <div>
//                 <div className="form-group">
//                   <label htmlFor="username">Username</label>
//                   <Input
//                     type="text"
//                     className="form-control"
//                     name="username"
//                     value={username}
//                     onChange={onChangeUsername}
//                     validations={[required, vusername]}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="email">Email</label>
//                   <Input
//                     type="text"
//                     className="form-control"
//                     name="email"
//                     value={email}
//                     onChange={onChangeEmail}
//                     validations={[required, email]}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="password">Password</label>
//                   <Input
//                     type="password"
//                     className="form-control"
//                     name="password"
//                     value={password}
//                     onChange={onChangePassword}
//                     validations={[required, vpassword]}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <button className="btn btn-primary btn-block">Sign Up</button>
//                 </div>
//               </div>
//             )}
//             {message && (
//               <div className="form-group">
//                 <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
//                   {message}
//                 </div>
//               </div>
//             )}
//             <CheckButton
//               style={{ display: "none" }}
//               ref={(c) => {
//                 setCheckBtn(c);
//               }}
//             />
//           </Form>
//         </div>
//       </div>
//     );
//   }
// }
// function mapStateToProps(state) {
//   const { message } = state.message;
//   return {
//     message,
//   };
// }
// export default connect(mapStateToProps)(Register);
