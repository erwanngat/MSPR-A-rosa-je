import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';  
//import './styles.css'; // Assurez-vous d'importer le fichier CSS

const Profil = () => {
  const navigate = useNavigate();  

  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    avatar: 'https://media.discordapp.net/attachments/953971728504209488/1338663545088376953/image.png?ex=67ade154&is=67ac8fd4&hm=9800472a8756cb9aa53ea9c35a67f260fc91395eb2b8dba7c2edd2b147b8bc60&=&format=webp&quality=lossless&width=1177&height=662', // Une image d'avatar de profil par défaut
    tel: "07 42 42 42 42"
});

  const handleEdit = () => {
    alert("Fonction d'édition à implémenter");
    // Edite a faire
  };

  const handleLogout = () => {
    sessionStorage.setItem('email', "");
    navigate("/login");
    
    // Ajoute ici la logique de déconnexion
  };

  return (
    <div className="profile-container bg-profil">
      <div className="profile-card">
        <div className="profile-header">
          <img src={user.avatar} alt="Avatar" className="profile-avatar" />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.tel}</p>
        </div>

        <div className="profile-actions">
          <button onClick={handleEdit} className="profile-btn">Edit Profile</button>
          <button onClick={handleLogout} className="profile-btn logout-btn">Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default Profil;
