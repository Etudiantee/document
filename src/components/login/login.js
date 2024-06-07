import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import '../login/login.css';
const Login = () => {
  const [TLC, setTLC] = useState('');
  const [pass, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const loginStatus = localStorage.getItem("loginStatus");
    if (loginStatus) {
        setError(loginStatus);
        setTimeout(() => {
            localStorage.clear();
            window.location.reload();
        }, 3000);
    }

    if (msg) {
        setTimeout(() => {
            setMsg("");
        }, 5000);
    }
}, [msg]);

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('TLC', TLC);
      formData.append('pass', pass);

      const response = await axios.post('http://localhost/devtest/reactjs/logged.php', formData);

      if (response.data.success) {
        // Redirect to admin or user dashboard based on role
        if (response.data.role === 'admin') {
          // Store TLC in session storage
          sessionStorage.setItem('TLC', TLC);
          // Navigate to Admin Dashboard
          window.location.href = '/AdminDashboard';
        } else {
            sessionStorage.setItem('TLC', TLC);
          window.location.href = '/AdminPNT';
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

 

  return (
    <div className='bo1'>
            <div className="form">
                <p>
                    {error ? <span className='error'>{error}</span> : <span className='success'>{msg}</span>}
                </p>
                <p className="form-title" style={{ fontFamily: 'serif' }}>Connexion</p>
                <div className="input-container">
                    <label style={{ fontFamily: 'serif', fontSize: '15px' }}>Matricule</label>
                    <input type="text" placeholder="Matricule" value={TLC} onChange={(e) => setTLC(e.target.value)} />
                </div>
                <div className="input-container">
                    <label style={{ fontFamily: 'serif', fontSize: '15px' }}>Mot de passe</label>
                    <input type="password" placeholder="Mot de passe" value={pass} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button  className="submit" type="submit" onClick={handleLogin}>Se Connecter</button>
                  
            </div>
        </div>
   
  );
};

export default Login;

   
     