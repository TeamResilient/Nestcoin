import React, { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { SocialIcon } from "react-social-icons";

import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
import { Loader } from ".";

const companyCommonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

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

const Welcome = () => {
  const { currentAccount, connectWallet, airdropTokens } = useContext(TransactionContext);


  // // declare array for the loyal customer addresses
  const [customerAddresses, setcustomerAddresses] = useState([]);
  // declare array for their rewards
  const [reward, setreward] = useState([]);
  // a boolean state to allow that only one of upload file button and airdrop token buttons show at a time
   const [isFileUpload, setisFileUpload] = useState(false);
   const [total, settotal] = useState("0");


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
  const totalairdrop = async () => {
    try {
      //const { ethereum } = window;


      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const data = await transactionsContract.totalSupply().then((tot)=> tot.toString());
        console.log(data/1e18)
        settotal(data/1e18)
         //return data
          
          // You can add supply now to whatever part
          // of your page you want it displayed
      
        // console.log(data)
        // settotal(data)
  
        // window.localStorage.setItem("transactionCount", currentTransactionCount);
      
      
    }
   // console.log(data)
 // settotal(data)
  } 
    catch (error) {
      console.log(error);
  
      throw new Error("No ethereum object");
    }
  }

  useEffect(() => {
    totalairdrop()
  }, []);

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    await airdropTokens(customerAddresses, reward)
     setisFileUpload(false)
   alert("succesfully sent reward")
  
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Reward Loyal Customers <br /> across the world
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            send loyalty tokens at the click of a button. Easy, Fast, and At Once.
          </p>
          {!currentAccount && (
            <button
              type="button"
              onClick={connectWallet}
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
            >
              <AiFillPlayCircle className="text-white mr-2" />
              <p className="text-white text-base font-semibold">
                Connect Wallet
              </p>
            </button>
          )}

         

          {/* <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
              Reliability
            </div>
            <div className={companyCommonStyles}>Simple</div>
            <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
              Security
            </div>
            <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
              Web 3.0
            </div>
            <div className={companyCommonStyles}>Ownership</div>
            <div className={`rounded-br-2xl ${companyCommonStyles}`}>
              Blockchain
            </div>
          </div> */}
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
               
              </div>
              <div>
                <p className="text-white font-light text-sm">
                  {shortenAddress(currentAccount)}
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                  Nestcoin
                </p>
                <p className="text-white font-semibold text-sm mt-1">
                 {total} $NCT Distributed
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <form>
           

{!isFileUpload
              ?  <Input type="file" id="csvFile" accept=".csv"  handleChange={handleChange} />
              : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Airdrop Tokens
                </button>
              )}
               
              </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
