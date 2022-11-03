import React,{useState,useEffect} from 'react';
import UserService from "../services/user.service";

const Home = ({setTabOpend}) => {
    const [content,setContent] = useState("")
    useEffect(() => {
        setTabOpend("HOME")
        UserService.getPublicContent().then(
            response => {
                setContent(response.data);
            },
            error => {
                setContent(
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString());
            }
          );
        return () => {
            setContent("")
        };
    }, []);
    return (
        <div className="container">
            <header className="jumbotron">
                <h3>{content}</h3>
            </header>
        </div>
    );
}

export default Home;

