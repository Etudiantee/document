import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FeuilleAdmin() {
  const [dayOfOrigin, setDayOfOrigin] = useState('');
  const [TLC, setTLC] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (dayOfOrigin && TLC) {
      fetchData();
    }
  }, [dayOfOrigin, TLC]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost/devtest/reactjs/feuilleadmin.php`, {
        params: { dayOfOrigin, TLC }
      });
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        setData(responseData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Logout = () => {
    localStorage.setItem("login", "");
    localStorage.setItem("loginStatus", "logged out successfully");
    window.location.href = '/logout';
  };

  return (
    <div className='bo2'>
      
      <div className="App">
        <div className="container-fluid mt-5 pt-4">
          <header className='head1'>
          <div className='num' style={{ marginTop: '130px', fontSize: '20px', position: 'absolute', top: '10px', left: '25px' }}>
              <span className="label">N°FDL: </span>
              <span className="value">{data.length > 0 ? data[0].id_FDL : ''}</span>
            </div>
            <div className="left"></div>
            <div className="center">
              <h1 className="title" style={{ fontFamily: 'DejaVu Sans Mono, monospace' }}>JOURNEY LOG</h1>
            </div>
          </header>
          <label  class="info"style={{fontSize:'20px',marginRight:'500px'}}>Choisir la date et la matricule:</label>
          <label style={{fontSize:'19px'}}>Date : </label>
          <input
            type="date"
            name="dayOfOrigin"
            className="t1 date-input"
            value={dayOfOrigin}
            onChange={(e) => setDayOfOrigin(e.target.value)}
            style={{ border: '1px solid #82C3BF', boxShadow: '0 0 1px #82C3BF' }}
          />
          <label style={{fontSize:'19px'}}>Matricule :</label>
          <input
          
            type="text"
            name="TLC"
            className="t1 text-input"
            value={TLC}
            onChange={(e) => setTLC(e.target.value)}
            style={{ border: '1px solid #82C3BF', boxShadow: '0 0 1px #82C3BF' }}
          />

          <table className='m1' border={1}>
            <thead className='hed'>
              <tr style={{ color: 'white' }}>
                <th rowSpan={3} style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>Day</th>
                <th rowSpan={3} style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>FLT ID</th>
                <th colSpan={2} style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>Leg</th>
                <th colSpan={7} style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>Flight Hours UTC</th>
                <th colSpan={5} style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>Fuel (Kilograms)</th>
              </tr>
              <tr style={{ color: 'white' }}>
                <th rowSpan={2} style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>From</th>
                <th rowSpan={2} style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>To</th>
                <th rowSpan={2} style={{ backgroundColor: '#5893A4' }}>Expected Dep Time</th>
                <th colSpan={3} style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>Block times</th>
                <th colSpan={3} style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>Airborne</th>
                <th rowSpan={2} style={{ backgroundColor: '#5893A4' }}>Previous Fuel</th>
                <th rowSpan={2} style={{ backgroundColor: '#5893A4' }}>Added Fuel</th>
                <th rowSpan={2} style={{ backgroundColor: '#5893A4' }}>Fuel at Departure</th>
                <th rowSpan={2} style={{ backgroundColor: '#5893A4' }}>Fuel Used</th>
                <th rowSpan={2} style={{ backgroundColor: '#5893A4' }}>Remaining Fuel</th>
              </tr>
              <tr style={{ color: 'white' }}>
                <th style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>Out</th>
                <th style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>In</th>
                <th style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>Block Time</th>
                <th style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>Off</th>
                <th style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>On</th>
                <th style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>Flight Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td><input disabled type="text" value={row.DAY_OF_ORIGIN} /></td>
                  <td><input disabled type="text" value={row.FLIGHT_NO} /></td>
                  <td><input disabled type="text" value={row.FROM_AIRPORT} /></td>
                  <td><input disabled type="text" value={row.TO_AIRPORT} /></td>
                  <td><input type="text" disabled value={row.EXPECTED_DEPARTURE_TIME} /></td>
                  <td><input type="time" value={row.OUT_TIME} /></td>
                  <td><input type="time" value={row.IN_TIME} /></td>
                  <td><input type="text" value={row.BLOCK_TIME} readOnly /></td>
                  <td><input type="time" value={row.OFF_TIME} /></td>
                  <td><input type="time" value={row.ON_TIME} /></td>
                  <td><input type="text" value={row.FLIGHT_TIME} readOnly /></td>
                  <td><input type="text" value={row.PREVIOUS_FUEL} /></td>
                  <td><input type="text" value={row.ADDED_FUEL} /></td>
                  <td><input type="text" value={row.DEPARTURE_FUEL} /></td>
                  <td><input type="text" value={row.FUEL_USED} /></td>
                  <td><input type="text" value={row.REMAINING_FUEL} /></td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#82C3BF', color: 'white' }}>
                <th colSpan={3} style={{ visibility: 'hidden', border: 'none', backgroundColor: '#82C3BF' }}></th>
                <th style={{ backgroundColor: '#82C3BF' }}>Day Time</th>
                <th style={{ backgroundColor: '#82C3BF' }}>Night Time</th>
                <th style={{ backgroundColor: '#82C3BF' }}>Desert Day Time</th>
                <th style={{ backgroundColor: '#82C3BF' }}>Desert Night Time</th>
                <th style={{ backgroundColor: '#82C3BF' }}>ToT Block Time</th>
                <th style={{ backgroundColor: '#82C3BF' }}>Deadhead</th>
                <th colSpan={2} style={{ backgroundColor: '#82C3BF', textAlign: 'center' }}>ToT Airborne</th>
                <th colSpan={4} style={{ backgroundColor: '#82C3BF', textAlign: 'center' }}>Crew Name</th>
              </tr>
              {data.map((row, index) => (
                <tr key={index}>
                  <td colSpan={3} style={{ visibility: 'hidden' }}></td>
                  <td><input disabled type="text" value={row.day_time} /></td>
                  <td><input disabled type="text" value={row.night_time} /></td>
                  <td><input disabled type="text" value={row.desert_day_time} /></td>
                  <td><input disabled type="text" value={row.desert_night_time} /></td>
                  <td><input type="text" disabled value={row.tot_block_time} /></td>
                  <td colSpan={2}><input type="text" value={row.deadhead} /></td>
                  <td colSpan={1}><input type="time" value={row.tot_airborne} /></td>
                  <td colSpan={4}><input type="text" value={row.crew_name} readOnly /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div id="table2">
          <h2 style={{ fontFamily: 'Georgia, serif' }}>Delays</h2>
          <table className='small-table m1'>
            <thead>
              <tr style={{ color: 'white' }}>
              <th style={{ backgroundColor: '#B4E1D1', textAlign: 'center' }}>DC</th>
                <th style={{ backgroundColor: '#B4E1D1', textAlign: 'center' }}>DL</th>
              
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                 
                  <td>
                    <select value={row.DC}>
                      {[...Array(100)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </td>
                  <td><input type="text" value={row.DL} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div id="crewTable">
          <div className="container">
            <h1 style={{ fontFamily: 'Georgia, serif' }}>Crew Table</h1>
            <table className="table m1">
              <thead>
                <tr>
                  <th>CD</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Key</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.CD}</td>
                    <td>{row.name}</td>
                    <td>{row.position}</td>
                    <td>{row.key}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeuilleAdmin;
