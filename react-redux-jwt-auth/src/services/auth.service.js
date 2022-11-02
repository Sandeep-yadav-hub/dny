import axios from "axios";
const API_URL = "http://localhost:8080/api/auth/";
class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", { username, password })
      .then((response) => {
        return response.data;
      });
  }
  logout() {
    return axios.post(API_URL+"logout",{id:JSON.parse(localStorage.getItem("user")).id}).then(
      (response)=>{
        console.log(response)
        localStorage.removeItem("user");
      }
    )
  }
  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
    });
  }
}
export default new AuthService();
