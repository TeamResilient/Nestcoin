import React, { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";
import { NavLink } from "react-router-dom";



import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";

function Home() {
  const { currentAccount, connectWallet } = useContext(TransactionContext);
  return (
    <div className="home">
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-7">
            <img
              class="img-fluid rounded mb-4 mb-lg-0"
              src="http://placehold.it/900x400"
              alt=""
            />
          </div>
          <div class="col-lg-5">
            <h1 class="font-weight-light">Home page</h1>
            <p>
              WELCOME.<br/>
              TEAM RESILENT is here to integrate your Company with WEB3
            </p> {!currentAccount
              ?   <button type="button" className="btn btn-primary"
              onClick={connectWallet}>Connect Wallet</button>
              : (
                <NavLink className="btn btn-primary" to="/SendRewards">
                Explore functions
              </NavLink>
              )}
          
         

          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
