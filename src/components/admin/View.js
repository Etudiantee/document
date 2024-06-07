import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import './recherche.css';

class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            currentPage: 1,
            contactsPerPage: 50,
            searchQuery: '' // Initialize search query state
        };
        this.headers = [
            { key: 'matricule', label: 'MATRICULE' },
            { key: 'nom', label: 'NOM' },
            { key: 'prenom', label: 'PRENOM' },
            { key: 'base', label: 'BASE' },
            { key: 'college', label: 'COLLEGE' },
            { key: 'secteur', label: 'SECTEUR' },
            { key: 'pass', label: 'MOT DE PASSE' }
        ];
        this.deleteContact = this.deleteContact.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrevios = this.handlePrevios.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this); // Bind handleSearchChange function
    }

    componentDidMount() {
        this.fetchContacts();
    }

    fetchContacts() {
        const url = 'http://localhost/devtest/reactjs/contacts.php/';
        axios.get(url)
            .then(response => response.data)
            .then(data => {
                this.setState({ contacts: data });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du PNT:', error);
            });
    }

    deleteContact(id, event) {
        event.preventDefault();
        if (window.confirm("Êtes-vous sûr de vouloir supprimer?")) {
            axios.post(`http://localhost/devtest/reactjs/contacts.php/?delete=${id}`)
                .then(response => {
                    if (response.status === 200) {
                        alert("PNT supprimé avec succès");
                        this.fetchContacts(); // Refresh contacts after deletion
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la suppression du PNT:', error);
                });
        }
    }

    handleNext() {
        const { currentPage, contactsPerPage, contacts } = this.state;
        const pageCount = Math.ceil(contacts.length / contactsPerPage);
        if (currentPage < pageCount) {
            this.setState({ currentPage: currentPage + 1 });
        }
    }

    handlePrevios() {
        const { currentPage } = this.state;
        if (currentPage > 1) {
            this.setState({ currentPage: currentPage - 1 });
        }
    }

    handleSearchChange(event) {
        this.setState({ searchQuery: event.target.value }); // Update searchQuery state with input value
    }

    render() {
        const { contacts, currentPage, contactsPerPage, searchQuery } = this.state;

        // Filter contacts based on search query
        const filteredContacts = contacts.filter(contact => {
            const { TLC,nom, email, base, college, secteur, pass } = contact;
            return (
                (TLC && TLC.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (nom && nom.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (email && email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (base && base.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (college && college.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (secteur && secteur.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (pass && pass.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        });

        const indexOfLastContact = currentPage * contactsPerPage;
        const indexOfFirstContact = indexOfLastContact - contactsPerPage;
        const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

        return (
            <body >
                <div className='bob1'>
            <div className="container">
             

                {/* Search input field */}
                <div className="ui-input-container">
                    <input
                        placeholder="Rechercher un PNT"
                        value={searchQuery}
                        onChange={this.handleSearchChange}
                        required=""
                        className="ui-input"
                        type="text"
                    />
                    <div className="ui-input-underline"></div>
                    <div className="ui-input-highlight"></div>
                    <div className="ui-input-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2"
                                stroke="currentColor"
                                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                            ></path>
                        </svg>
                    </div>
                </div>
                <div className="table-container"  >
                <table className="table table-bordered table-striped " style={{border:'none'}}>
                    <thead>
                        <tr>
                            {this.headers.map(h => <th key={h.key}>{h.label}</th>)}
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentContacts.map((item, key) => (
                            <tr key={key} style={{color:'white',border:'none'}} >
                                <td style={{color:'white'}}>{item.TLC}</td>
                                <td style={{color:'white'}}>{item.nom}</td>
                                <td style={{color:'white'}}>{item.prenom}</td>
                                <td style={{color:'white'}}>{item.base}</td>
                                <td style={{color:'white'}}>{item.college}</td>
                                <td style={{color:'white'}}>{item.secteur}</td>
                                <td style={{color: 'white'}}>
  {item.pass ? '*'.repeat(item.pass.length) : ''}
</td>
                                <td>
                                    <Link to={`/Edit/${item.id}`} className="btn btn-primary btn-xs " style={{background:'#0038a8',border:'#0038a8'}} >Edit</Link>
                                    <Link to="#" onClick={(event) => this.deleteContact(item.id, event)} className="btn btn-danger btn-xs" style={{background:'#b31b1b',border:'#b31b1b'}}>Supprimer</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                <div className='d-flex justify-content-end'>
                    <Pagination>
                        <Pagination.Prev onClick={this.handlePrevios} disabled={currentPage === 1} />
                        {Array(Math.ceil(filteredContacts.length / contactsPerPage)).fill(null).map((_, index) => (
                            <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => this.setState({ currentPage: index + 1 })}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={this.handleNext} disabled={currentPage === Math.ceil(filteredContacts.length / contactsPerPage)} />
                    </Pagination>
                </div>
            </div>
            </div>
            </body>
        );
    }
}

export default Contact;
