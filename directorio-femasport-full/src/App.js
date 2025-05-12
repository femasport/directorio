import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';
import logo from './logo.png';

const GOOGLE_SHEET_ID = "1crEAXlbo9a9tE0eykP28g9c62CeytCQxV8ouSFv-V7Q";
const SHEET_NAMES = ["DIRECTORIO", "USL", "NWSL"];

const fetchSheet = async (sheetName) => {
  const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
  const response = await fetch(url);
  const csv = await response.text();
  return Papa.parse(csv, { header: true }).data;
};

function App() {
  const [auth, setAuth] = useState(false);
  const [data, setData] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = e.target.user.value;
    const pass = e.target.pass.value;
    if (user === "femasport" && pass === "DIRFEMA**") {
      setAuth(true);
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  };

  useEffect(() => {
    if (auth) {
      Promise.all(SHEET_NAMES.map(fetchSheet)).then((results) => {
        const all = results.flat();
        setData(all);
      });
    }
  }, [auth]);

  if (!auth) {
    return (
      <div className="login">
        <img src={logo} alt="logo" className="logo" />
        <form onSubmit={handleLogin}>
          <input type="text" name="user" placeholder="Usuario" />
          <input type="password" name="pass" placeholder="Contraseña" />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <img src={logo} alt="logo" className="logo-small" />
      <h1>Directorio Femasport</h1>
      <table>
        <thead>
          <tr>
            {data[0] && Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((val, j) => (
                <td key={j}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;