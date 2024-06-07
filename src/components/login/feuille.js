import React, { useState, useEffect } from 'react';

function Feuille(props) {
    const [userData, setUserData] = useState(null);
    const matricule = props?.location?.state?.matricule;

    useEffect(() => {
        console.log("matricule:", matricule); // Add this line
        if (matricule) {
            fetchUserData(matricule);
        }
    }, [matricule]);

    const fetchUserData = (matricule) => {
        const url = `http://localhost/devtest/reactjs/getUserData.php`;
        const headers = {
            'Content-Type': 'application/json',
        };
        const data = {
            matricule: matricule,
        };
        console.log("Sending request to:", url); // Add this line
        console.log("Request data:", data); // Add this line
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log("Response data:", data); // Add this line
                if (data.error) {
                    throw new Error(data.error);
                }
                setUserData(data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error.message);
            });
    };

    return (
        <div>
            <h2>User Data</h2>
            {userData ? (
                <div>
                    <p>Matricule: {userData.matricule}</p>
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    {/* Display other user data as needed */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Feuille;
