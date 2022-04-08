import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import Logo from './logo';
import './navbar.css';
import { useMoralis } from 'react-moralis'

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const {isAuthenticated,logout} = useMoralis();

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <Logo />
        </div>
        <div className="gpt3__navbar-links_container">
          <p><a href="#dashboard">Home</a></p>
          <p><a href="#rewards">Send Rewards</a></p>
          <p><a href="#dashboard">Admin Dashboard</a></p>
          <button className="button-33" onClick={logout}>Logout</button>
        </div>
      </div>
      <div className="gpt3__navbar-menu">
        {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
        <div className="gpt3__navbar-menu_container scale-up-center">
          <div className="gpt3__navbar-menu_container-links">
          <p><a href="#dashboard">Home</a></p>
          <p><a href="#rewards">Send Rewards</a></p>
          <p><a href="#dashboard">Admin Dashboard</a></p>
          <button className="button-33" onClick={logout}>Logout</button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;


