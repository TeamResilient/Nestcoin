import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";
import { contractABIT, contractAddressT } from "../utils/nestcoin";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
 
  return transactionsContract;
};

const createEthereumContractT = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddressT, contractABIT, signer);
   
    return transactionsContract;
  };
  

const airdropTokens = async(customers, rewards) => {
  const contract = createEthereumContract();
  //const options = {value: ethers.utils.parseEther(tokens)};
 try {
   await contract.airdrop(customers, rewards);}
 catch(error){
   console.log(error)
  alert("only admins can call this function");
 }
}


const balance = async(_address) => {
   const contract = createEthereumContractT();
    //const options = {value: ethers.utils.parseEther(tokens)};
   try {

       
   const hy=   await contract.balanceOf(_address);
  return hy;
    
    }
   catch(error){
     console.log(error)
    alert("only admins can call this function");
   }
  }


//   const ethers = require('ethers');
// const genericErc20Abi = require(..../.../Erc20.json);
// const tokenContractAddress = '0x...';
// const provider = ...; (use ethers.providers.InfuraProvider for a Node app or ethers.providers.Web3Provider(window.ethereum/window.web3) for a React app)
// const contract = new ethers.Contract(tokenContractAddress, genericErc20Abi, provider);
// const balance = (await contract.balanceOf((await provider.getSigners())[0].address)).toString();




const assignAdmin = async (_newAddress) => {
  try {
    if (ethereum) {
      const transactionsContract = createEthereumContract();
      await transactionsContract.assignAdmin(_newAddress);

   
    }
  } catch (error) {
    console.log(error);

    throw new Error("No ethereum object");
  }
}

const deleteSM = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        await transactionsContract.kill();
  
     
      }
    } catch (error) {
      console.log(error);
  
      throw new Error("No ethereum object");
    }
  }

const removeAdmin = async (_newAddress) => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        await transactionsContract.removeAdmin(_newAddress)
       
        // const hashing =  await transactionsContract.removeAdmin(_newAddress);
        // console.log(hashing.hash)
     
      }
    } catch (error) {
      console.log(error);
  
      throw new Error("No ethereum object");
    }
  }




export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  
  
 



  const checkIfWalletIsConnect = async () => {
    
    try {
      if (!ethereum) return alert("Please install MetaMask.");
     // const provider = new ethers.providers.Web3Provider(ethereum);
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
      //  setCurrentAccount(await provider.lookupAddress(accounts[0]));
      setCurrentAccount(accounts[0]);
//         var address = '0x1234...';
// var name = await provider.lookupAddress(address);
// // ethers.js automatically checks that the forward resolution matches.

      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  

  const connectWallet = async () => {
   
    try {
     
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet, 
        airdropTokens,
        assignAdmin,
        removeAdmin,
        deleteSM,
        balance
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
