import React from 'react'
import abi from '../../utils/Nestdrop.json'
import { useState } from 'react'
import { ethers } from 'ethers'

export default function RemoveAdmin(){
  const contractAddress = "0x893dBc6F19de9Fc46B5E80Ca870EfFC82082a5DD";
  const [address, setAddress] = useState({
    adminAddress:""
  })

  const doRemoveAdmin = async() => {
    try {
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
			  const signer = provider.getSigner();
			  const contract = new ethers.Contract(contractAddress, abi.abi, signer);
        const tx = await contract.removeAdmin(address.adminAddress)
        const receipt = await tx.wait()
        if(receipt.status===1){
          alert('Admin Added Succefully')
        }else{
          alert("Admin was not added Succesfully")
        }
      }else{
        alert("You need to connect yoour wallet");
      }
    } catch (error) {
      console.log(error);
      alert("Only Admins can access this function");
    }
  }
  function handleChange(event) {
    const {name, value} = event.target
    setAddress(prev => ({
        ...prev,
        [name]: value
    }))
  }


  return (
    <div className="gpt3__header section__padding"> 
        <div className="gpt3__header-content">
          <label>
           <div className="enter_csv gradient__text"> Remove Admin </div>
           <br/>
            <input id="address" className="normal_input" type="text" placeholder="Enter Admin Address" value={address.adminAddress} onChange={handleChange} name="adminAddress" />
          </label>
        </div>
        
       
        <button onClick={doRemoveAdmin} className="file_button remove_button">Remove Admin</button>
    </div>
  )

}






