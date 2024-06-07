// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ handleLogout }) => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Accueil</Link>
                </li>
                <li>
                    <Link to="/Insert">Ajouter</Link>
                </li>
                <li>
                    <Link to="/Editt/:matricule">Modifier</Link>
                </li>
                <li>
                    <Link to="/Edit">Feuille de Ligne</Link>
                </li>
                <li>
                    <Link to="/Delete">Supprimer</Link>
                </li>
                <li>
                    <button onClick={handleLogout}>Logout</button>
                    
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
