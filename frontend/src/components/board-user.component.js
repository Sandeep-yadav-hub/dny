import React, {useEffect,useState } from "react";
import UserService from "../services/user.service";

const BoardUserComponent = () => {
    const [content,setContent] = useState("")

    useEffect(() => {
        UserService.getUserBoard().then(
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

export default BoardUserComponent;

