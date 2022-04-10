import React, { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

import { NavLink } from "react-router-dom";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";


const Input = ({ placeholder, type, handleChange}) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    // value={value}
    onChange={(e) => handleChange(e)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

function SendRewards() {


  const { currentAccount, airdropTokens, balance } = useContext(TransactionContext);
 
 
  const [invoker, setinvoker] = useState('');
const [event, setevent] =useState(false)
const [totalA, settotalA] = useState("");
const [contractbalance, setcontractbalance] = useState("");
  // // declare array for the loyal customer addresses
  const [customerAddresses, setcustomerAddresses] = useState([]);
  // declare array for their rewards
  const [reward, setreward] = useState([]);
  // a boolean state to allow that only one of upload file button and airdrop token buttons show at a time
   const [isFileUpload, setisFileUpload] = useState(false);
   //const [total, settotal] = useState("0");


  // function to convert csv file from input file to arr, it receives a str paramater
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
    // mapping over the secondArr to get a distinct arr of rewards and returning it
    const values = secondArr.map((item) => {

      return item[1]; // [rewards]
    });
    //   console.log(JSON.stringify(values))
    //     console.log(JSON.stringify(address))
    // updating secondArr before returning
    secondArr = [address, values];  // secondArr=[[addresses],[rewards]]
    return secondArr;
  };
  // const ctt = document.getElementById("csvFile");
  // ctt.onChange = function () {
  //   console.log("hi");
  // };
  // function to handle uploading file and getting initial readings
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

  const { ethereum } = window;
  const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
  
    return transactionsContract;
  };
  const test=  async()=>{
    const bug = await balance("0x43F71FbD58E9600924F49A53c6FDE787977C2b9d")
   // alert(bug)
    setcontractbalance(bug/1e18)

 } 
  const handleSubmit = async (e) => {
    try{
    if (customerAddresses.length <= 200){
  e.preventDefault();
  await airdropTokens(customerAddresses, reward)
    setisFileUpload(false)
  alert("succesfully sent reward")}
  else { alert("only 200 addresses per batch")}
  test()
    }
    catch(error){
      console.log(error)
     alert("only admins can call this function");
    }
  
  };
  
  useEffect(()=>{
   // let isSubscribed = true
    
   
   test()
   //setcontractbalance(test/1e18)

 //  return () => isSubscribed = false
  })

  useEffect(() => {
    let NestcoinContract;
  
    const onDispatchRewards = (sender, totalF) => {
      console.log("DispatchRewards", sender, totalF);
      setinvoker(sender)
      settotalA(totalF/1e18)
      
      setevent(true)
     
    
    };
    
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      NestcoinContract = new ethers.Contract(contractAddress, contractABI, signer);
      NestcoinContract.on("DispatchRewards", onDispatchRewards);
    }
  
    return () => {
      if (NestcoinContract) {
        NestcoinContract.off("DispatchRewards", onDispatchRewards);
      }
    };
  }, []);

  return (
    <div className="about">
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-7">
            <p>Contract Balance: {contractbalance}NCT</p>
          </div>

          
          <div class="col-lg-5">
            <h1 class="font-weight-light">Send Rewards</h1>
            {!currentAccount
              ? <p className="p-3 mb-2 bg-info text-white">
            Connect your Wallet in the Nav Bar
            </p>
              : (!isFileUpload
                ?
                <p>
              Batch transactions to reward loyal customers and harness the power of Web3.Transfer coins to other addresses swiftly and securely.
              <Input type="file" id="csvFile" accept=".csv" className="custom-file-label" handleChange={handleChange} />
            </p>
              
           : (isFileUpload
            ? <p>
              Batch transactions to reward loyal customers and harness the power of Web3.Transfer coins to other addresses swiftly and securely.
              <br />
              <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary"
                >
                  Send Rewards
                </button>
            </p>
           :   <p></p>  
           )
            )
           }
            
          </div>
          
        </div>
        {!event
              ?  <p></p>
              : (
                <p> EVENT: {invoker} has sent a total of {totalA} loyalty tokens</p>
              )}
        
      </div>
    </div>
  )
}

export default SendRewards;
