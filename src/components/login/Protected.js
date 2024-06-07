import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Protected = (props) => {
    const navigate = useNavigate();
    const { Component } = props;

    useEffect(() => {
        let login = localStorage.getItem("login");
        if (!login) {
            localStorage.setItem("loginStatus", "please login to see nav");
            navigate("/", { replace: true });
        }
    }, [navigate]);

    return (
        <Component />
    );
}

export default Protected;
