import React from 'react';
import Layout1 from '../Layout1/layout1';
// import './dashboardtest.css';

const Table = () => {
  

  return (
    <Layout1>
        <table>
  <tr>
    <th>Company</th>
    <th>Contact</th>
    <th>Country</th>
  </tr>
  <tr>
    <td>Alfreds Futterkiste</td>
    <td>Maria Anders</td>
    <td>Germany</td>
  </tr>
  <tr>
    <td>Centro comercial Moctezuma</td>
    <td>Francisco Chang</td>
    <td>Mexico</td>
  </tr>
</table>
    </Layout1>
    );
  };
  
  export default Table;