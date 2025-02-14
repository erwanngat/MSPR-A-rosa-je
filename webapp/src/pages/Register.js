import React, { useState } from 'react';

const Register = () => {
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted', { lastname, password });
    // Ajouter la logique de soumission du formulaire
    if (password != passwordConfirm) {
        alert("different passwords")
        setPassword("");
        setPasswordConfirm("");
    }else if (password.length < 8){
        alert('password to short, need to have minimum 8 characters')
    }
    else{
        alert('good')
    }

  };

  return (
    <div className="login-containe0r bg-login">
      <div className="login-form">
      <h2>A'Rosa-je</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="lastname">Lastname :</label>
            <input 
              type="text" 
              id="lastname" 
              value={lastname} 
              onChange={(e) => setLastname(e.target.value)} 
              placeholder="Enter your lastname" 
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="firstname">Firstname :</label>
            <input 
              type="text" 
              id="firstname" 
              value={firstname} 
              onChange={(e) => setFirstname(e.target.value)} 
              placeholder="Enter your firstname" 
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email :</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="tel">Phone number :</label>
            <input 
              type="text" 
              id="tel" 
              value={tel} 
              onChange={(e) => setTel(e.target.value)} 
              placeholder="Enter your Phone number" 
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password (minimum 8 characters)" 
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input 
              type="password" 
              id="passwordconfirm" 
              value={passwordConfirm} 
              onChange={(e) => setPasswordConfirm(e.target.value)} 
              placeholder="Confirm your password (minimum 8 characters)" 
              required
            />
          </div>
         
          <div className="forgot-password">
            <a href="/Login">Have an acount?</a>
          </div>
          <button type="submit" className="login-btn">SIGN UP</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
