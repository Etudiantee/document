import React, { useState, useEffect } from 'react';
import '../PNT/feuille.css'; // Ensure your CSS file is imported
import CrewTable from './CrewTable';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Assuming you're using axios for HTTP requests
import { useNavigate } from 'react-router-dom/dist';
function Visualiser() {
  const [activeSection, setActiveSection] = useState('table3');
  const navigate = useNavigate();

  const [DAY_OF_ORIGIN, setDAY_OF_ORIGIN] = useState('');
  const [TLC, setTLC] = useState('');
  const [tableData, setTableData] = useState([]);
  const [message, setMessage] = useState(''); 
 
  const [tot_block_time, setTotalBlockTime] = useState('');
  const [tot_airborne, setTotalAirborneTime] = useState('');
 // State to hold success/error messages

  const [formData, setFormData] = useState({
    DAY_OF_ORIGIN: '',
    FLIGHT_NO: '',
    EXPECTED_DEPARTURE_TIME: '',
    FROM_AIRPORT: '',
    TO_AIRPORT: ''
  });
  const [dayOfOriginOptions, setDayOfOriginOptions] = useState([]);


  useEffect(() => {
    const storedTLC = sessionStorage.getItem('TLC');
    console.log('Stored TLC:', storedTLC);  // Debugging log
    if (storedTLC) {
      setTLC(storedTLC);
    } else {
      window.location.href = '/';
    }
  }, []);
  useEffect(() => {
    // Fetch flight details when DAY_OF_ORIGIN changes
    const fetchFlightDetails = async () => {
      try {
        const response = await axios.get(`http://localhost/devtest/reactjs/vis.php?TLC=${TLC}&dayOfOrigin=${formData.DAY_OF_ORIGIN}`);
        if (response.data) {
          setTableData(response.data); // Update table data with response from getFlightDetails.php
        }
      } catch (error) {
        console.error('Error fetching flight details:', error);
      }
    };
  
    if (formData.DAY_OF_ORIGIN && TLC) {
      fetchFlightDetails();
    }
  }, [formData.DAY_OF_ORIGIN, TLC]);
  
  
 // Function to calculate total block time
 const calculateTotalBlockTime = () => {
  let totalBlockTimeSeconds = 0;
  tableData.forEach(row => {
    if (row.OUT_TIME && row.IN_TIME) {
      const blockTime = calculateBlockTime(row.OUT_TIME, row.IN_TIME);
      totalBlockTimeSeconds += convertTimeToSeconds(blockTime);
    }
  });
  const formattedTotalBlockTime = convertSecondsToTime(totalBlockTimeSeconds);
  setTotalBlockTime(formattedTotalBlockTime);
};
 // Function to calculate total airborne time
 const calculateTotalAirborneTime = () => {
  let totalAirborneTimeSeconds = 0;
  tableData.forEach(row => {
    if (row.OFF_TIME && row.ON_TIME) {
      const airborneTime = calculateFlightTime(row.OFF_TIME, row.ON_TIME);
      totalAirborneTimeSeconds += convertTimeToSeconds(airborneTime);
    }
  });
  const formattedTotalAirborneTime = convertSecondsToTime(totalAirborneTimeSeconds);
  setTotalAirborneTime(formattedTotalAirborneTime);
};

// Function to convert time string to total seconds
const convertTimeToSeconds = (time) => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Function to convert total seconds to time string
const convertSecondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}:00`;
};
 // Update total block time and total airborne time when tableData changes
 useEffect(() => {
  calculateTotalBlockTime();
  calculateTotalAirborneTime();
}, [tableData]);

  const handleTimeInputChange = (index, key, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][key] = value;
    if (key === 'OUT_TIME' || key === 'IN_TIME') {
      updatedTableData[index]['BLOCK_TIME'] = calculateBlockTime(updatedTableData[index]['OUT_TIME'], updatedTableData[index]['IN_TIME']);
    } else if (key === 'OFF_TIME' || key === 'ON_TIME') {
      updatedTableData[index]['FLIGHT_TIME'] = calculateFlightTime(updatedTableData[index]['OFF_TIME'], updatedTableData[index]['ON_TIME']);
    }
    setTableData(updatedTableData);
  };

  const calculateBlockTime = (outTime, inTime) => {
    if (!outTime || !inTime) return '';
    const out = new Date(`2000-01-01T${outTime}`);
    const in_ = new Date(`2000-01-01T${inTime}`);
    const diff = Math.abs(in_ - out);
    const hours = Math.floor(diff / 36e5);
    const minutes = Math.floor((diff % 36e5) / 6e4);
    const seconds = Math.floor((diff % 6e4) / 1000);
    return `${hours}:${minutes}:${seconds}`;
  };

  const calculateFlightTime = (offTime, onTime) => {
    if (!offTime || !onTime) return '';
    const off = new Date(`2000-01-01T${offTime}`);
    const on_ = new Date(`2000-01-01T${onTime}`);
    const diff = Math.abs(on_ - off);
    const hours = Math.floor(diff / 36e5);
    const minutes = Math.floor((diff % 36e5) / 6e4);
    const seconds = Math.floor((diff % 6e4) / 1000);
    return `${hours}:${minutes}:${seconds}`;
  };



  const handleInputChange = (index, key, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][key] = value;
    setTableData(updatedTableData);
  };

  
  const handleInsertData = async () => {
    try {
      // Check if formData.DAY_OF_ORIGIN is empty
      if (!formData.DAY_OF_ORIGIN) {
        alert('Please select a date before submitting.');
        return;
      }
  
      // Calculate total block time and total airborne time
      calculateTotalBlockTime();
      calculateTotalAirborneTime();
  
      // Update tableData with totalBlockTime and totalAirborneTime
      const updatedTableData = tableData.map(row => ({
        ...row,
        tot_block_time: tot_block_time,
        tot_airborne: tot_airborne
      }));
  
      // Proceed with insertion
      const response = await axios.post('http://localhost/devtest/reactjs/vis.php', updatedTableData);
  
      // Handle successful response
      const responseMessages = response.data.map(item => item.message).join(' ');
      setMessage(responseMessages, 'ajouter avec succes'); // Update the message state with response messages
  
      // Navigate to CrewTable
      navigate('/CrewTable', { state: { TLC, dayOfOrigin: formData.DAY_OF_ORIGIN } });
    } catch (error) {
      // Handle error
      console.error('Error inserting data:', error);
      setMessage('There was an error inserting the data: ' + error.message); // Update the message state with error
          navigate('/CrewTable', { state: { TLC, dayOfOrigin: formData.DAY_OF_ORIGIN } });

    }
  };
  

  


  useEffect(() => {
    // Set TLC value in formData when TLC changes in location state
    setFormData((prevFormData) => ({
      ...prevFormData,
      TLC: TLC
    }));

    // Fetch DAY_OF_ORIGIN options from the database based on TLC
    const fetchDayOfOriginOptions = async () => {
      try {
        const response = await axios.get(`http://localhost/devtest/reactjs/visualiser.php?tlc=${TLC}`);
        setDayOfOriginOptions(response.data);
      } catch (error) {
        console.error('Error fetching DAY_OF_ORIGIN options:', error);
      }
    };

    if (TLC) {
      fetchDayOfOriginOptions();
    }
  }, [TLC]);
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
 

  return (
    <div className='bo2'>
      <div className="App">
        

        <div className="container-fluid mt-5 pt-4">
        <header className='head1'>
  <div class="left">
 
  </div>
  <div class="center">
    <h1 class="title" style={{fontFamily:'DejaVu Sans Mono, monospace'}}>JOURNEY LOG</h1>
  </div>

</header>
<label class="info">Select a date to see the related data :</label>
<select name="DAY_OF_ORIGIN" value={formData.DAY_OF_ORIGIN} onChange={handleChange}>
                <option value="">-- Select the date to fill in --</option>
                {dayOfOriginOptions.map((option, index) => (
                  <option key={index} value={option.DAY_OF_ORIGIN}>{option.DAY_OF_ORIGIN}</option>
                ))}
              </select>
<input hidden
  type="text"
  name="TLC"
  className="t1 text-input"
  value={TLC}
  onChange={(e) => setTLC(e.target.value)}
/>
          <div id="table1">
            <table className='m1' border={1} >
            <thead className='hed'>
  <tr style={{color:'white' }}>
    <th rowSpan={3} style={{ backgroundColor: '#5893A4' , textAlign: 'center'}}>Day</th>
    <th rowSpan={3} style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>FLT ID</th>
    <th colSpan={2} style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>Leg</th>
    <th colSpan={7} style={{ backgroundColor: '#5893A4' , textAlign: 'center'}}>Flight Hours UTC</th>
    <th colSpan={5} style={{ backgroundColor: '#5893A4' , textAlign: 'center'}}>Fuel (Kilograms)</th>
  </tr>
  <tr style={{color:'white'}}>
    <th rowSpan={2} style={{ backgroundColor: '#5893A4' , textAlign: 'center'}}>From</th>
    <th rowSpan={2} style={{ backgroundColor: '#5893A4' , textAlign: 'center'}}>To</th>
    <th rowSpan={2} style={{ backgroundColor: '#5893A4' }}>Expected Dep Time</th>
    <th colSpan={3} style={{ backgroundColor: '#5893A4' , textAlign: 'center'}}>Block times</th>
    <th colSpan={3} style={{ backgroundColor: '#5893A4' , textAlign: 'center'}}>Airborne</th>
    <th rowSpan={2} style={{ backgroundColor: '#5893A4' }}>Previous Fuel</th>
    <th rowSpan={2} style={{ backgroundColor: '#5893A4' }}>Added Fuel</th>
    <th rowSpan={2} style={{ backgroundColor: '#5893A4' }}>Fuel at Departur-e</th>
    <th rowSpan={2} style={{ backgroundColor: '#5893A4' }}>Fuel Used</th>
    <th rowSpan={2} style={{ backgroundColor: '#5893A4' }}>Remain. Fuel</th>
  </tr>
  <tr style={{color:'white'}}>
    <th style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>Out</th>
    <th style={{ backgroundColor: '#5893A4' , textAlign: 'center'}}>In</th>
    <th style={{ backgroundColor: '#5893A4' , textAlign: 'center'}}>Block Time</th>
    <th style={{ backgroundColor: '#5893A4' , textAlign: 'center'}}>Off</th>
    <th style={{ backgroundColor: '#5893A4' , textAlign: 'center'}}>On</th>
    <th style={{ backgroundColor: '#5893A4', textAlign: 'center' }}>Flight Time</th>
  </tr>
</thead>


              <tbody>
                {tableData && tableData.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input disabled
                        type="text"
                        value={row.DAY_OF_ORIGIN}
                        onChange={(e) => handleInputChange(index, 'DAY_OF_ORIGIN', e.target.value)}
                      />
                    </td>
                    <td>
                      <input disabled
                        type="text"
                        value={row.FLIGHT_NO}
                        onChange={(e) => handleInputChange(index, 'FLIGHT_NO', e.target.value)}
                      />
                    </td>
                    <td>
                      <input disabled
                        type="text"
                        value={row.FROM_AIRPORT}
                        onChange={(e) => handleInputChange(index, 'FROM_AIRPORT', e.target.value)}
                      />
                    </td>
                    <td>
                      <input disabled
                        type="text"
                        value={row.TO_AIRPORT}
                        onChange={(e) => handleInputChange(index, 'TO_AIRPORT', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text" disabled
                        value={row.EXPECTED_DEPARTURE_TIME}
                        onChange={(e) => handleInputChange(index, 'EXPECTED_DEPARTURE_TIME', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="time" disabled
                        value={row.OUT_TIME}
                        onChange={(e) => handleTimeInputChange(index, 'OUT_TIME', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="time" disabled
                        value={row.IN_TIME}
                        onChange={(e) => handleTimeInputChange(index, 'IN_TIME', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text" disabled
                        value={calculateBlockTime(row.OUT_TIME, row.IN_TIME)}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="time" disabled
                        value={row.OFF_TIME}
                        onChange={(e) => handleTimeInputChange(index, 'OFF_TIME', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="time" disabled
                        value={row.ON_TIME}
                        onChange={(e) => handleTimeInputChange(index, 'ON_TIME', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text" disabled
                        value={calculateFlightTime(row.OFF_TIME, row.ON_TIME)}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text" disabled
                        value={row.PREVIOUS_FUEL}
                        onChange={(e) => handleInputChange(index, 'PREVIOUS_FUEL', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text" disabled
                        value={row.ADDED_FUEL}
                        onChange={(e) => handleInputChange(index, 'ADDED_FUEL', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text" disabled
                        value={row.DEPARTURE_FUEL}
                        onChange={(e) => handleInputChange(index, 'DEPARTURE_FUEL', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text" disabled
                        value={row.FUEL_USED}
                        onChange={(e) => handleInputChange(index, 'FUEL_USED', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text" disabled
                        value={row.REMAINING_FUEL}
                        onChange={(e) => handleInputChange(index, 'REMAINING_FUEL', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
<tr style={{ backgroundColor: '#82C3BF' ,color:'white'}}>
  <th colSpan={3} style={{ visibility: 'hidden', border: 'none', backgroundColor: '#82C3BF' }}></th>
  <th style={{ backgroundColor: '#82C3BF' }}>Day Time</th>
  <th style={{ backgroundColor: '#82C3BF' }}>Night Time</th>
  <th style={{ backgroundColor: '#82C3BF' }}>Desert Day Time</th>
  <th style={{ backgroundColor: '#82C3BF' }}>Desert Night Time</th>
  <th style={{ backgroundColor: '#82C3BF' }}>ToT Block Time</th>
  <th style={{ backgroundColor: '#82C3BF' }}>Deadhead</th>
  <th colSpan={2} style={{ backgroundColor: '#82C3BF', textAlign: 'center' }}>ToT Airborne</th>
  <th colSpan={4} style={{ backgroundColor: '#82C3BF' , textAlign: 'center'}}>Crew Name </th>
</tr>


{tableData && tableData.length > 0 && (
  <tr key="additionalRow">
    <td colSpan={3} style={{ visibility: 'hidden', border:'none'  }}></td>
    <td>
      <input
        type="text" disabled
        value={tableData[0].day_time} // Assuming the first row's data is used
        onChange={(e) => handleInputChange(0, 'day_time', e.target.value)}
      />
    </td>
    <td>
      <input
        type="text" disabled
        value={tableData[0].night_time} // Assuming the first row's data is used
        onChange={(e) => handleInputChange(0, 'night_time', e.target.value)}
      />
    </td>
    <td>
      <input
        type="text" disabled
        value={tableData[0].desert_day_time} // Assuming the first row's data is used
        onChange={(e) => handleInputChange(0, 'desert_day_time', e.target.value)}
      />
    </td>
    <td>
      <input
        type="text" disabled
        value={tableData[0].desert_night_time} // Assuming the first row's data is used
        onChange={(e) => handleInputChange(0, 'desert_night_time', e.target.value)}
      />
    </td>
    <td>
      <input
        type="text" disabled
        value={tot_block_time} // Assuming the first row's data is used
        onChange={(e) => handleInputChange(0, 'tot_block_time', e.target.value)}
      />
    </td>
    <td>
      <input
        type="text" disabled
        value={tableData[0].deadhead} // Assuming the first row's data is used
        onChange={(e) => handleInputChange(0, 'deadhead', e.target.value)}
      />
    </td>
    <td colSpan={2}>
      <input
        type="text" disabled
        value={tot_airborne} // Assuming the first row's data is used
        onChange={(e) => handleInputChange(0, 'tot_airborne', e.target.value)}
      />
    </td>
    <td colSpan={4}>
      <input
        type="text" disabled
        value={tableData[0].crew_name} // Assuming the first row's data is used
        onChange={(e) => handleInputChange(0, 'crew_name', e.target.value)}
      />
    </td>
  </tr>
)}

              </tbody>
            </table>
          </div>

          <div id="table2">
            <h2 style={{fontFamily:'Georgia,serif'}}>Delays</h2>
            <table className='small-table m1'>
              <thead>
                <tr style={{color:'white'}}>
                <th style={{ backgroundColor: '#B4E1D1', textAlign: 'center' }}>DC</th>
                <th style={{ backgroundColor: '#B4E1D1', textAlign: 'center' }}>DL</th>
                </tr>
              </thead>
              <tbody>
                {tableData && tableData.map((row, index) => (
                  <tr key={index}>

                    <td>
                    <div>
                   
                    <select
  value={row.DC}
  onChange={(e) => handleInputChange(index, 'DC', e.target.value)}
>
  {[...Array(100)].map((_, i) => (
    <option key={i + 1} value={i + 1}>{i + 1}</option>
  ))}
</select>
</div>

                    </td>
                    <td>
                      <input 
                        type="text" disabled
                        value={row.DL}
                        onChange={(e) => handleInputChange(index, 'DL', e.target.value)}
                      />
                    </td>
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
              {tableData && tableData.map((row, index) => (
                  <tr key={index}>


                    <td>  <input disabled
                        type="text" 
                        value={row.CD}
                        onChange={(e) => handleInputChange(index, 'CD', e.target.value)}
                      /></td>
                    <td> <input disabled
                        type="text"
                        value={row.name}
                        onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                      /></td>
                    <td> <input disabled
                        type="text"
                        value={row.position}
                        onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                      /></td>
                    <td> <input disabled
                        type="text"
                        value={row.key}
                        onChange={(e) => handleInputChange(index, 'key', e.target.value)}
                      /></td>
                  </tr>
               ))}
              </tbody>
            </table>
          </div>
        </div>

        

  
        </div>
      </div>
    </div>
  );
}

export default Visualiser;
