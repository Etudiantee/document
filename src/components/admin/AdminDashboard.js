// AdminDashboard.js

import React, { useState ,useEffect} from 'react';
import '../admin/AdminDashboard.css';
import CrewTable from '../PNT/CrewTable';
import { Link } from 'react-router-dom/dist';
import Contact from './View';
import Create from './Insert';
import Update from './Edit';
import { useNavigate } from 'react-router-dom/dist';
import FeuilleAdmin from './feuilleadmin';

import axios from 'axios';


function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('table1');
  const navigate = useNavigate();
  const [TLC, setTLC] = useState('');
  useEffect(() => {
    const storedTLC = sessionStorage.getItem('TLC');
    console.log('Stored TLC:', storedTLC);  // Debugging log
    if (storedTLC) {
      setTLC(storedTLC);
    } else {
      window.location.href = '/';
    }
  }, []);
  const handleLogout = async () => {
    try {
      await axios.get('http://localhost/devtest/reactjs/logout.php');
      sessionStorage.removeItem('TLC');
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };




  const renderSection = () => {
    switch (activeSection) {
      case 'View':
        return <Contact />;
      case 'Insert':
        return <Create />;
    
      case 'feuilleadmin':
        return <FeuilleAdmin />;
      
      default:
        return (
          <section id="table1">
          
            <Contact />
          </section>
        );
    }
  };

  return (
    <div className='bo2'>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <ul className="navbar-nav">
            <li className="nav-item">
            <div class="lefttt">
    <img class="image1" src="rar.png" alt="Tunisair Logo" />
  </div>
            </li>
            <li className="nav-item">
              <div className="centered-buttons"> {/* Centered buttons */}
                <button className="nav-link btn" onClick={() => setActiveSection('View')}>Acceuil</button>
                <button className="nav-link btn" onClick={() => setActiveSection('Insert')}>Ajouter</button>
               
                <button className="nav-link btn" onClick={() => setActiveSection('feuilleadmin')}>Feuille</button>
                
              </div>
            </li>
            <li className="nav-item">
            <h2>Welcome to Admin Dashboard</h2>
     
            <button   className="nav-link btn" onClick={handleLogout}>
                <p> Se déconnecter</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container-fluid mt-5 pt-4">
        {renderSection()}
      </div>
    </div>
  );
}

export default AdminDashboard;
