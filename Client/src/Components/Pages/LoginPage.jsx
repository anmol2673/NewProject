import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Design/Loginpage.css';

function LoginPage() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
  useEffect(()=>{
    const auth = localStorage.getItem('user');
    if(auth){
      navigate('/');
    }
  })
  

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    
      let result = await fetch('http://localhost:9000/login', {
        method: 'post',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      result = await result.json();
      console.warn(result);
      localStorage.setItem("user",JSON.stringify(result));
      navigate('/');
    
  };

  const handleForgotPassword = () => {
    // Add logic for handling forgot password here
    console.log('Forgot password clicked');
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-title">Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUserName(e.target.value)} placeholder='username' />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' />
        </div>
        <button type="submit" onClick={handleLogin} className="submit-button">Login</button>
        <button className="forgot-password-button" onClick={handleForgotPassword}>Forgot Password?</button>
      </div>
    </div>
  );
}

export default LoginPage;
