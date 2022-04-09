import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";

function Navigation() {

  const { currentAccount, connectWallet } = useContext(TransactionContext);
  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            Nestcoin Cinema
          </NavLink>
          <div> {!currentAccount
              ?   <button type="button" className="btn btn-primary"
              onClick={connectWallet}>Connect Wallet</button>
              : (
                <p className="text-white font-light text-sm">
                  Welcome: {shortenAddress(currentAccount)}
                </p>
              )}
                
                
                </div>
          <div>
            <ul className="navbar-nav ml-auto">

           

              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                  <span className="sr-only">(current)</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/SendRewards">
                  Send Rewards
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/Admin">
                  Admin Page
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/Customers">
                  Customers
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
