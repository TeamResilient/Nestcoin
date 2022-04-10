import React, { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

import { NavLink } from "react-router-dom";
import { TransactionContext } from "../context/TransactionContext";


function Admin() {
  const { currentAccount, assignAdmin, removeAdmin, deleteSM } = useContext(TransactionContext);

  const [address, setaddress] = useState('');
  const [removed, setremoved] = useState('');
  const [invoker, setinvoker] = useState('');
const [event, setevent] =useState(false)
const [eventtype, seteventtype] = useState('');
  const addAdmin = async (e) => {
    try{
    e.preventDefault();
    await assignAdmin(address)
     
   alert("admin successfully added")
   setaddress('')
  }
  catch(error){
    console.log(error)
   alert("only admins can call this function");
  }
  
  };

  const remAdmin = async (e) => {
    try{
      e.preventDefault();
      await removeAdmin(address)
      
     
     alert("admin succesfully removed")
     setaddress('')
    }
    catch(error){
      console.log(error)
     alert("only admins can call this function");
    }
   
  };

  const destroy = async (e) => {
    try {
    e.preventDefault();
    await deleteSM()
    
   
   alert("contract successfully destroyed")
   setaddress('')
    }
    catch(error){
      console.log(error)
     alert("only admins can call this function");
    }
  };


  useEffect(() => {
    let NestcoinContract;
  
    const onRemovedAdmin = (removee, admin) => {
      console.log("RemovedAdmin", removee, admin);
      setinvoker(removee)
      setremoved(admin)
      seteventtype('removed')
      setevent(true)
    
    };
    
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      NestcoinContract = new ethers.Contract(contractAddress, contractABI, signer);
      NestcoinContract.on("RemovedAdmin", onRemovedAdmin);
    }
  
    return () => {
      if (NestcoinContract) {
        NestcoinContract.off("RemovedAdmin", onRemovedAdmin);
      }
    };
  }, []);

  useEffect(() => {
    let NestcoinContract;
  
    const onAssignedAdmin = (removee, admin) => {
      console.log("AssignedAdmin", removee, admin);
      setinvoker(removee)
      setremoved(admin)
      seteventtype('added')
      setevent(true)
    
    };
    
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      NestcoinContract = new ethers.Contract(contractAddress, contractABI, signer);
      NestcoinContract.on("AssignedAdmin", onAssignedAdmin);
    }
  
    return () => {
      if (NestcoinContract) {
        NestcoinContract.off("AssignedAdmin", onAssignedAdmin);
      }
    };
  }, []);

  //emit RemovedAdmin(_admin);
  return (
    <div className="contact">
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
            <h1 class="font-weight-light">Update Admin</h1>

            {!currentAccount
              ?  <p className="p-3 mb-2 bg-info text-white">
              Connect your Wallet in the Nav Bar
              </p>
              : (
                <p>
            <input type="text" class="form-control" placeholder="Enter ethereum Address" aria-label="Admin" aria-describedby="basic-addon1" value={address} onChange={e => setaddress(e.target.value)} />
            <br />
            <button
                  type="button"
                  onClick={addAdmin}
                  className="btn btn-primary ml-3"
                >
                  Add Admin
                </button>
                <button
                  type="button"
                  onClick={remAdmin}
                  className="btn btn-warning ml-3"
                >
                  remove Admin
                </button>
                <br /><br />
                <br /><br />
                <button
                  type="button"
                  onClick={destroy}
                  className="btn btn-danger"
                >
                  Destroy Contract
                </button>
            </p>
              )}

            
          </div>
        </div>
        {!event
              ?  <p></p>
              : (
                <p>EVENT: {invoker} has {eventtype} {removed} as admin</p>
              )}
        
      </div>
    </div>
  );
}

export default Admin;
