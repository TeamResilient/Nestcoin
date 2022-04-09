import React, { useState, useEffect } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import Logo from './logo';
import './navbar.css';
import {networks} from '../../network';

const Navbar = () => {

  const[account, setAccount] = useState(null);

  const [network, setNetwork] = useState('');

  const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert("Get MetaMask -> https://metamask.io/");
				return;
			}

			// Fancy method to request access to account.
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
		
			// Boom! This should print out public address once we authorize Metamask.
			console.log("Connected", accounts[0]);
			setAccount(accounts[0]);
      
    
		} catch (error) {
			console.log("something went wrong")
		}
	}

	
	  

	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			console.log('Make sure you have metamask!');
			return;
		} else {
			console.log('We have the ethereum object', ethereum);
		}
		
		const accounts = await ethereum.request({ method: 'eth_accounts' });

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setAccount(account);
		} else {
			setAccount(null)
			console.log('No authorized account found');
		}
		
		// This is the new part, we check the user's network chain ID
		const chainId = await ethereum.request({ method: 'eth_chainId' });
		setNetwork(networks[chainId]);

		ethereum.on('chainChanged', handleChainChanged);
		
		// Reload the page when they change networks
		function handleChainChanged(_chainId) {
			window.location.reload();
		}

		ethereum.on('accountsChanged', handleWalletDisconnection);

    function handleWalletDisconnection(accounts){
		if (accounts.length === 0) {
			// MetaMask is locked or the user has not connected any accounts
			setAccount(null)
			window.location.reload();
		  } else{
			setAccount(accounts[0]);
			// Do any other work!
		  }
      
	  
    }
	};



	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <Logo />
        </div>
        <div className="gpt3__navbar-links_container">
           { account==null && <button className="button-33" onClick={connectWallet}>Connect</button>  }
		   
        </div>
      </div>
    </div>
  );
};

export default Navbar;


