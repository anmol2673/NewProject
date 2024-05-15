import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Pages/Navbar';
import HomePage from './Components/Pages/HomePage';
import Dashboard from './Components/Pages/Dashboard';
import LoginPage from './Components/Pages/LoginPage';
import NewContent from './Components/Pages/NewContent';
import Settings from './Components/Pages/Settings';
import Logout from './Components/Pages/Logout';
import Footer from './Components/Pages/Footer';
import PrivateComponent from './Components/PrivateComponent'

function App() {



  return (






    <div className='App'>
      <BrowserRouter>
        <Navbar />


        <Routes>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />

         
          <Route element={<PrivateComponent />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-content" element={<NewContent />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Logout />} />
           </Route>

         

          


        </Routes>
      </BrowserRouter>
      <Footer />
    </div>


  );
}

export default App;
