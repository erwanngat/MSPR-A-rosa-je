import React from 'react';
import ReactDOM from 'react-dom/client';
//import './styles/login.css';
//import './styles/profil.css';
//import './styles/index.css';
import './importStyles'; // Importez tous les fichiers CSS du dossier styles




import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
