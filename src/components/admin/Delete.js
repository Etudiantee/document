import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class DeleteContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = { matricule: '', nom: '', prenom: '', base: '', college: '', secteur: '', pass: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });

    // Fetch contact details when matricule is changed
    if (name === 'matricule') {
      axios.get(`http://localhost/devtest/reactjs/deleteContact.php?matricule=${value}`)
        .then(response => {
          const { data } = response;
          if (data.length > 0) {
            const { matricule, nom, prenom, base, college, secteur, pass } = data[0];
            this.setState({ matricule, nom, prenom, base, college, secteur, pass });
          }
        })
        .catch(error => {
          console.error('Error fetching contact details:', error);
        });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    // Submit request to delete contact
    axios.delete(`http://localhost/devtest/reactjs/deleteContact.php?matricule=${this.state.matricule}`)
      .then(response => {
        console.log(response);
        alert('Contact Deleted');
        // Clear the form after successful deletion
        this.setState({ matricule: '', nom: '', prenom: '', base: '', college: '', secteur: '', pass: '' });
      })
      .catch(error => {
        console.error('Error deleting contact:', error);
      });
  }

  render() {
    return (
      <div className="container">
        <h1 className="page-header text-center">Delete Contact</h1>
        <Link to="/" className="btn btn-primary btn-xs">Home</Link>
        <div className="col-md-12">
          <div className="panel panel-primary">
            <div className="panel-body">
              <form onSubmit={this.handleSubmit}>
                <label>Matricule</label>
                <input type="text" name="matricule" className="form-control" value={this.state.matricule} onChange={this.handleChange} />

                <label>Nom</label>
                <input type="text" name="nom" className="form-control" value={this.state.nom} onChange={this.handleChange} disabled />

                <label>Prénom</label>
                <input type="text" name="prenom" className="form-control" value={this.state.prenom} onChange={this.handleChange} disabled />

                <label>Base</label>
                <input type="text" name="base" className="form-control" value={this.state.base} onChange={this.handleChange} disabled />

                <label>Collège</label>
                <input type="text" name="college" className="form-control" value={this.state.college} onChange={this.handleChange} disabled />

                <label>Secteur</label>
                <input type="text" name="secteur" className="form-control" value={this.state.secteur} onChange={this.handleChange} disabled />

                <label>Password</label>
                <input type="text" name="pass" className="form-control" value={this.state.pass} onChange={this.handleChange} disabled />

                <br />
                <input type="submit" className="btn btn-danger btn-block" value="Delete Contact" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DeleteContact;

