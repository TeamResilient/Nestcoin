import React from 'react'
import abi from '../../utils/Nestdrop.json'
import { useState } from 'react'
import { ethers } from 'ethers'
import './reward.css';

export default function Reward(){
  const contractAddress = "0x893dBc6F19de9Fc46B5E80Ca870EfFC82082a5DD";

  const [customerAddresses, setcustomerAddresses] = useState([]);
  // declare array for their rewards
  const [reward, setreward] = useState([]);
  // a boolean state to allow that only one of upload file button and airdrop token buttons show at a time
   const [isFileUpload, setisFileUpload] = useState(false);
  

  const csvToArray = (str) => {
    // split arrays the file according to \n newline regex
   // const firstArr = str.split("\n");
   const firstArr = str.split("\r\n");
    // mapping over the array to create a second arr
    let secondArr = firstArr.map((item) => {
      return item.split(',');
    });
    // secondArr=[[address, reward],[address, reward] etc]
    // console.log(secondArr)

    // mapping over the secondArr to get a distinct arr of address
    const address = secondArr.map((item) => item[0] // [addresses]
    );

    console.log(address);
    // mapping over the secondArr to get a distinct arr of rewards and returning it
    const values = secondArr.map((item) => {

      return item[1]; // [rewards]
    });

    console.log(values);
    //   console.log(JSON.stringify(values))
    //     console.log(JSON.stringify(address))
    // updating secondArr before returning
    secondArr = [address, values];  // secondArr=[[addresses],[rewards]]
    return secondArr;
  };

  function handleChange(e) {
    e.preventDefault();
    // input file tag is is cvsFile
    console.log("ok");
   // const csvFile = document.getElementById("csvFile");
   const input = e.target.files[0];
    // reading the file
    const reader = new FileReader();

    reader.onload = function(e) {
      const text = e.target.result;
      // calling our csvToArray(str) to convert to array
      // data here is like our secondArray earlier
      const data = csvToArray(text);

      // setisFileUpload to true as we've uploaded our file
      setisFileUpload(true);

      // update our customerAddresses array
      setcustomerAddresses(data[0]);

      // update our rewards array
      setreward(data[1]);

    };

    reader.readAsText(input);

  };

  const airdrop = async() => {
    try {
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
			  const signer = provider.getSigner();
			  const contract = new ethers.Contract(contractAddress, abi.abi, signer);
        const tx = await contract.airdrop(customerAddresses, reward);
        const receipt = await tx.wait()
        if(receipt.status===1){
          alert('AirDrop sucessfully')
        }else{
          alert("Airdrop not successful")
        }
      }else{
       alert("You need to connect yoour wallet");
      }
    } catch (error) {
      console.log(error);
      alert("Only Admins can call this function");
    }
  }

  const handleSubmit = async (e) => {
    
    e.preventDefault()
    
      await airdrop();
      console.log(customerAddresses);
      console.log(reward);
     setisFileUpload(false)
  
  
  };


    



  return (
    <div className="gpt3__header section__padding"> 
        <div className="gpt3__header-content">
        <label>
            <div className="enter_csv gradient__text"> Enter Csv </div>
            <br/>
            <input id="address" className="custom-file-input" type="file" placeholder="adminAddress" step="0.0001" onChange={(e) => handleChange(e)} name="adminAddress" />
          </label>
        </div>
        {isFileUpload && <button className="file_button" onClick={handleSubmit} >Reward Tokens</button>}
    </div>
  )

}






