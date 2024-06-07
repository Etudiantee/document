import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../admin/insert.css';
class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matricule: '',
      nom: '',
      prenom: '',
      base: '',
      college: '',
      secteur: '',
      pass: '',
      errorMessage: '' // State variable to hold error message
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
 

  handleChange(event) { 
    const { name, value } = event.target; 
    this.setState({ [name]: value });  
  
    if (name === 'pass') {
      const isValidPassword = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z]).{8,}$/.test(value);
      if (!isValidPassword) { 
        this.setState({ errorMessage: "Le mot de passe doit comporter au moins 8 caractères et contenir au moins un caractère spécial." }); 
      } else { 
        this.setState({ errorMessage: "" }); 
      } 
    } 
    
    if (name === 'matricule') { 
      axios.get(`http://localhost/devtest/reactjs/contacts.php?matricule=${value}`)
        .then(response => { 
          const { data } = response; 
          if (data.length > 0) { 
            const { matricule, nom, prenom, base, college, secteur, pass } = data[0]; 
            this.setState({ matricule, nom, prenom, base, college, secteur, pass }); 
          } 
        }) 
        .catch(error => { 
          console.error('Erreur lors de la récupération des coordonnées:', error); 
        }); 
    } 
  }
  

  handleSubmit(event) {
    event.preventDefault();
  
    // Check if password meets criteria
    const isValidPassword = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z]).{8,}$/.test(this.state.pass);
    if (!isValidPassword) {
      // Set error message and prevent form submission
      this.setState({ errorMessage: "Le mot de passe doit comporter au moins 8 caractères et contenir au moins un caractère spécial." });
      return;
    }
  
    // Prepare form data
    const formData = new FormData();
    formData.append('matricule', this.state.matricule);
    formData.append('nom', this.state.nom);
    formData.append('prenom', this.state.prenom);
    formData.append('base', this.state.base);
    formData.append('college', this.state.college);
    formData.append('secteur', this.state.secteur);
    formData.append('pass', this.state.pass); // Include the "pass" attribute
  
    // Submit form data to update contact password
    axios.post(`http://localhost/devtest/reactjs/contacts.php?matricule=${this.state.matricule}`, formData)
      .then(response => {
        console.log(response);
        alert('Mot de passe ajouté pour le PNT dans ' + this.state.matricule);
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du mot de passe de PNT:', error);
        if (error.response && error.response.data && error.response.data.error === "Le matricule existe déjà") {
          // If the error indicates that matricule already exists, set state to display error message
          this.setState({ errorMessage: "Le matricule existe déjà" });
        } else {
          // For other errors, you can handle as required
          this.setState({ errorMessage: "Le matricule existe déjà" });
        }
      });
  }
  

  render() {
    return (
      <div className='bob3'>
      <div className="container insert1" >
        <h1 className="page-header text-center" style={{color:'white', fontFamily:'Georgia,serif'}}>Ajouter nouveau PNT</h1>
        <div className="col-md-12">
          <div className="panel panel-primary">
            <div className="panel-body">
              {this.state.errorMessage && ( // Display error message if it exists
                <div className="alert alert-danger" role="alert">
                  {this.state.errorMessage}
                </div>
              )}
              <form onSubmit={this.handleSubmit}>
                <label style={{color:'white',fontSize:'20px'}}>Matricule</label>
                <input type="text" name="matricule" className="form-control" value={this.state.matricule} onChange={this.handleChange} />

                <label style={{color:'white',fontSize:'20px'}}>Nom</label>
                <input type="text" name="nom" className="form-control" value={this.state.nom} onChange={this.handleChange} disabled />

                <label style={{color:'white',fontSize:'20px'}}>Prénom</label>
                <input type="text" name="prenom" className="form-control" value={this.state.prenom} onChange={this.handleChange} disabled />

               
                <label style={{color:'white',fontSize:'20px'}}>Base</label>
                <input type="text" name="base" className="form-control" value={this.state.base} onChange={this.handleChange} disabled />

                <label style={{color:'white',fontSize:'20px'}}>Collège</label>
                <input type="text" name="college" className="form-control" value={this.state.college} onChange={this.handleChange} disabled/>

                <label style={{color:'white',fontSize:'20px'}}>Secteur</label>
                <input type="text" name="secteur" className="form-control" value={this.state.secteur} onChange={this.handleChange} disabled/>

                <label style={{color:'white',fontSize:'20px'}}>Mot de passe</label>
                <input type="text" name="pass" className="form-control" value={this.state.pass} onChange={this.handleChange} />

                <br />
                <input type="submit" className="btn btn-primary btn-block" value="Ajouter" />
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default Create;

