import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import Logo from './logo';
import './navbar.css';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <Logo />
        </div>
        <div className="gpt3__navbar-links_container">
          <p><a href="#dashboard">Home</a></p>
          <p><a href="#data">Upload Data</a></p>
          <p><a href="#rewards">Send Rewards</a></p>
          <p><a href="#trigger">Trigger</a></p>
          <p><a href="#footer">Footer</a></p>
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
          <p><a href="#data">Upload Data</a></p>
          <p><a href="#rewards">Send Rewards</a></p>
          <p><a href="#trigger">Trigger</a></p>
          <p><a href="#footer">Footer</a></p>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;