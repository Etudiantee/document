import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminPNT from './AdminPNT';
import Updatefeuille from './updatefeuille';
import '../PNT/crew.css';

const CrewTable = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { TLC, setTLC } = location.state || { TLC: '' }; 
    const { dayOfOrigin, setDayOfOrigin} = location.state || { TLC: '' }; 
    const [crews, setCrews] = useState([]);
    const [newCrew, setNewCrew] = useState({ CD: '', name: '', position: '', key: '' });
    const [editCrew, setEditCrew] = useState(null);
    const cdOptions = [11, 12, 13, 14, 15, 21, 23, 24, 25, 41, 42, 43, 44, 45];
    const positionMapping = {
        11: 'Captain',
        12: 'Type Rating Instructor',
        13: 'Cpt Onbase training',
        14: 'Type Rating Examiner',
        15: 'Cpt Positioning',
        21: 'FO Normal flight',
        23: 'FO On base training',
        24: 'FO Trainee',
        25: 'FO Positioning',
        41: 'FA Normal flight',
        42: 'FA Online instruction',
        43: 'FA Offline instruction',
        44: 'FA Trainee',
        45: 'FA Positioning',
    };

    useEffect(() => {
        fetchCrews();
    }, [dayOfOrigin, TLC]);

    const fetchCrews = async () => {
        try {
            const response = await axios.get('http://localhost/devtest/reactjs/crud.php', {
                params: { dayOfOrigin, TLC }
            });
            setCrews(response.data);
        } catch (error) {
            console.error('Error fetching crews:', error);
            setCrews([]);
        }
    };

    const addCrew = async () => {
        if (Object.values(newCrew).some(field => field === '')) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await axios.post('http://localhost/devtest/reactjs/crud.php', { ...newCrew, dayOfOrigin, TLC });
            console.log('Response from server:', response.data);
            setNewCrew({ CD: '', name: '', position: '', key: '' });
            fetchCrews();
        } catch (error) {
            console.error('Error adding crew:', error);
            alert('Failed to add crew. Please try again.');
        }
    };

    const updateCrew = async (crew_id) => {
        if (!editCrew || Object.values(editCrew).some(field => field === '')) return;

        try {
            await axios.post('http://localhost/devtest/reactjs/crud.php', { crew_id, ...editCrew });
            setEditCrew(null);
            fetchCrews();
        } catch (error) {
            console.error('Error updating crew:', error);
            alert('Failed to update crew. Please try again.');
        }
    };

    const deleteCrew = async (crew_id) => {
        try {
            await axios.delete('http://localhost/devtest/reactjs/crud.php', {
                data: { crew_id }
            });
            fetchCrews();
        } catch (error) {
            console.error('Error deleting crew:', error);
            alert('Failed to delete crew. Please try again.');
        }
    };

    const handleCDChange = (e, setState) => {
        const CD = e.target.value;
        const position = positionMapping[CD] || '';
        setState(prevState => ({ ...prevState, CD, position }));
    };

    const handleNavigation = () => {
        
        navigate('/updatefeuille', { state: { TLC, dayOfOrigin } });
    };

    return (
        <body className='ap'>
            <div className="container">
                <h1 style={{fontFamily:'Georgia,serif'}}>Crew Table</h1>
                <input hidden
                type="text"
                name="dayOfOrigin"
                className="t1 date-input"
                value={dayOfOrigin}
                onChange={(e) => setDayOfOrigin(e.target.value)}
            />
            <input hidden
                type="text"
                name="TLC"
                className="t1 text-input"
                value={TLC}
                onChange={(e) => setTLC(e.target.value)}
            />
                <div className="row mb-3">
                    <div className="col">
                        <select
                            className="form-control"
                            value={newCrew.CD}
                            onChange={(e) => handleCDChange(e, setNewCrew)}
                        >
                            <option value="">Select CD</option>
                            {cdOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Position"
                            value={newCrew.position}
                            readOnly
                        />
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={newCrew.name}
                            onChange={(e) => setNewCrew({ ...newCrew, name: e.target.value })}
                        />
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Key"
                            value={newCrew.key}
                            onChange={(e) => setNewCrew({ ...newCrew, key: e.target.value })}
                        />
                    </div>
                    <div className="col">
                        <button className="btn btn-primary" style={{backgroundColor:'#365D86'}} onClick={addCrew}>Add Crew</button>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>CD</th>
                            <th>POSITION</th>
                            <th>NAME</th>
                            <th>KEY</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {crews?.map((crew) => (
                            <tr key={crew?.crew_id} style={{color:'white'}}>
                                <td style={{color:'white'}}>
                                    {editCrew && editCrew.crew_id === crew?.crew_id ? (
                                        <select
                                            className="form-control"
                                            value={editCrew.CD}
                                            onChange={(e) => handleCDChange(e, setEditCrew)}
                                        >
                                            <option value="">Select CD</option>
                                            {cdOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        crew?.CD
                                    )}
                                </td>
                                <td style={{color:'white'}}>
                                    {editCrew && editCrew.crew_id === crew?.crew_id ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editCrew.position}
                                            readOnly
                                        />
                                    ) : (
                                        crew?.position
                                    )}
                                </td>
                                <td style={{color:'white'}}>
                                    {editCrew && editCrew.crew_id === crew?.crew_id ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editCrew.name}
                                            onChange={(e) => setEditCrew({ ...editCrew, name: e.target.value })}
                                        />
                                    ) : (
                                        crew?.name
                                    )}
                                </td>
                                <td style={{color:'white'}}>
                                    {editCrew && editCrew.crew_id === crew?.crew_id ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editCrew.key}
                                            onChange={(e) => setEditCrew({ ...editCrew, key: e.target.value })}
                                        />
                                    ) : (
                                        crew?.key
                                    )}
                                </td>
                                <td style={{color:'white'}}>
                                    {editCrew && editCrew.crew_id === crew?.crew_id ? (
                                        <button className="btn btn-success" onClick={() => updateCrew(crew?.crew_id)}>Save</button>
                                    ) : (
                                        <button className="btn btn-primary" onClick={() => setEditCrew(crew)} style={{background:'#0038a8',border:'#0038a8'}}>Edit</button>
                                    )}
                                    <button className="btn btn-danger" onClick={() => deleteCrew(crew?.crew_id)} style={{background:'#b31b1b',border:'#b31b1b'}}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={handleNavigation} className="btn btn-primary mt-3" style={{marginLeft:'1300px',backgroundColor:'#365D86'}}>CONTINUE</button>
            </div>
        </body>
    );
};

export default CrewTable;
