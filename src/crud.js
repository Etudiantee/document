import logo from './logo.svg';
import './crud.css';
import React from 'react';
function Crud() {
  return (
    <body className='b11'>
    <div className='div1'>
      <form>
        <input type='button' value='ajout'name='ajout' className='ajout'/>
      </form>
    <table name='t' border={1}>
        <tr>
          <td>Nom</td>
          <td>Prenom</td>
          <td>Matricule</td>
          <td>base</td>
          <td>secteur</td>
          <td>Action</td>
        </tr>
        <tr>
          <td> klou</td>
          <td> bron</td>
          <td> 12</td>
          <td>airborne11 </td>
          <td> jerba</td>

          <td><input type='button'  name='delete'value='delete' className='delete'/>
          <input type='button' value='modifier' className='modifier'/>
          
          </td>
        </tr>
      
    </table> 
    </div>
    </body>
  );
}
export default Crud;