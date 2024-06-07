import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../admin/insert.css';
function Update() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contacts, setContact] = useState({
    TLC: '',
    nom: '',
    prenom: '',
    base: '',
    college: '',
    secteur: '',
    pass: ''
  });

  useEffect(() => {
    axios.get(`http://localhost/devtest/reactjs/contacts.php/?id=${id}`)
      .then(response => {
        setContact(response.data);
      })
      .catch(error => console.error('Erreur lors de la récupération des détails du PNT:', error));
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContact(prevState => ({
      ...prevState,
      [name]: value
    }));
    
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('TLC', contacts.TLC);
    formData.append('nom', contacts.nom);
    formData.append('prenom', contacts.prenom);
    formData.append('base', contacts.base);
    formData.append('college', contacts.college);
    formData.append('secteur', contacts.secteur);
    formData.append('pass', contacts.pass);
    
    axios.post(`http://localhost/devtest/reactjs/contacts.php/?id=${id}`, formData)
      .then(response => {
        if (response.status === 200) {
          alert('PNT mis à jour avec succès.');
          navigate('/AdminDashboard'); // Redirect to home page after successful update
        }
      })
      .catch(error => console.error('Erreur lors de la mise à jour de PNT:', error));
  };

  return (
    <body className='api'>
    <div className="container">
      <h1 className="page-header text-center" style={{color:'white',fontSize:'50px' ,fontFamily:'Georgia,serif'}}>Mise à jour PNT</h1>
      <Link to="/AdminDashboard" className="btn btn-primary btn-xs">Retour</Link>
      <div className="col-md-12">
        <div className="panel panel-primary">
          <div className="panel-body">
            <form onSubmit={handleSubmit}>
              <label style={{color:'white',fontSize:'20px'}}>Matricule</label>
              <input type="text" name="matricule" className="form-control" value={contacts.TLC} onChange={handleChange} />

              <label style={{color:'white',fontSize:'20px'}}>Nom</label>
              <input type="text" name="nom" className="form-control" value={contacts.nom} onChange={handleChange} disabled />

              <label style={{color:'white',fontSize:'20px'}}>Prénom</label>
              <input type="text" name="prenom" className="form-control" value={contacts.prenom} onChange={handleChange} disabled/>

              <label style={{color:'white',fontSize:'20px'}}>Base</label>
              <input type="text" name="base" className="form-control" value={contacts.base} onChange={handleChange} disabled/>

              <label style={{color:'white',fontSize:'20px'}}>Collège</label>
              <input type="text" name="college" className="form-control" value={contacts.college} onChange={handleChange} disabled/>

              <label style={{color:'white',fontSize:'20px'}}>Secteur</label>
              <input type="text" name="secteur" className="form-control" value={contacts.secteur} onChange={handleChange} disabled/>

              <label style={{color:'white',fontSize:'20px'}}>Mot de passe</label>
              <input type="text" name="pass" className="form-control" value={contacts.pass} onChange={handleChange} />

              <br />
              <input type="submit" className="btn btn-primary btn-block" value="Mise à jour PNT" />
            </form>
          </div>
        </div>
      </div>
    </div>
    </body>
  );
}

export default Update;
