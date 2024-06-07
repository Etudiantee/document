import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import AdminDashboard from './AdminDashboard';
function Edit() {
  const { matricule } = useParams();
  
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    base: '',
    college: '',
    secteur: '',
    pass: ''
  });
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContact(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Fetch contact details when matricule is changed
    if (name === 'matricule') {
      axios.get(`http://localhost/devtest/reactjs/edit.php?matricule=${value}`)
        .then(response => {
          const { data } = response;
          if (data.length > 0) {
            const { matricule, nom, prenom, base, college, secteur, pass } = data[0];
            setContact(prevState => ({
              ...prevState,
              matricule,
              nom,
              prenom,
              base,
              college,
              secteur,
              pass
            }));
          }
        })
        .catch(error => {
          console.error('Error fetching contact details:', error);
        });
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('pass', contact.pass);
    formData.append('matricule', contact.matricule);

    axios.post(`http://localhost/devtest/reactjs/edit.php/?matricule=${matricule}`, formData)
      .then(response => {
        if (response.status === 200) {
          alert('PNT mis à jour avec succès.');
          navigate('/AdminDashboard'); // Redirect to home page after successful update
        }
      })
      .catch(error => console.error('Erreur lors de la mise à jour de PNT:', error));
  };

  return (
    <div className="container">
      <h1 className="page-header text-center">Mise à jour PNT</h1>
     
      <div className="col-md-12">
        <div className="panel panel-primary">
          <div className="panel-body">
            <form onSubmit={handleSubmit}>
              <label>Matricule</label>
              <input type="text" name="matricule" className="form-control" value={contact.matricule} onChange={handleChange} />

              <label>Nom</label>
              <input type="text" name="nom" className="form-control" value={contact.nom} onChange={handleChange}disabled />

              <label>Prénom</label>
              <input type="text" name="prenom" className="form-control" value={contact.prenom} onChange={handleChange} disabled />

              <label>Base</label>
              <input type="text" name="base" className="form-control" value={contact.base} onChange={handleChange} disabled />

              <label>Collège</label>
              <input type="text" name="college" className="form-control" value={contact.college} onChange={handleChange} disabled />

              <label>Secteur</label>
              <input type="text" name="secteur" className="form-control" value={contact.secteur} onChange={handleChange} disabled />

              <label>Mot de passe</label>
              <input type="text" name="pass" className="form-control" value={contact.pass} onChange={handleChange} />

              <br />
              <input type="submit" className="btn btn-primary btn-block" value="Modifier" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
