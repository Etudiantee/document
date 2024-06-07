import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/admin/AdminDashboard';
import Protected from './components/login/Protected';
import Login from './components/login/login';
import Feuille from './components/PNT/feuille'; // Import Feuille component
import CrewTable from './components/PNT/CrewTable';
import Create from './components/admin/Insert';
import Update from './components/admin/Edit';
import Edit from'./components/admin/Editt';
import FeuilleAdmin from './components/admin/feuilleadmin';
import Updatefeuille from './components/PNT/updatefeuille';
import AdminPNT from './components/PNT/AdminPNT';
import Visualiser from './components/PNT/visualiser';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matricule: null // Initialize matricule state
    };
  }

  render() {
    const { matricule } = this.state;
    return (
      <BrowserRouter>
        <Routes>
          {/* Admin Dashboard */}
         
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/Insert" element={<Create />} />
          {/* Authentication */}
          <Route path="/" element={<Login />} />
          <Route path="/protected" element={<Protected />} />

          {/* Feuille */}
          <Route path="/feuille" element={<Feuille />} />
          <Route path="/CrewTable" element={<CrewTable />} />
          <Route path="/edit/:id" element={<Update />} />
          <Route path="/Editt/:matricule" element={<Edit />} />
          <Route path="feuilleadmin" element={<FeuilleAdmin />} />
          <Route path="updatefeuille" element={<Updatefeuille />} />
          <Route path="AdminPNT" element={<AdminPNT />} />
          <Route path="visualiser" element={<Visualiser />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
