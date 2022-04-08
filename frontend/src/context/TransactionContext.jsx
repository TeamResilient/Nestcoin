import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

const buytoken = async(address, tokens) => {
  const contract = createEthereumContract();
  const options = {value: ethers.utils.parseEther(tokens)};
  await contract.buyToken(address, options);
}

const airdropTokens = async(customers, rewards) => {
  const contract = createEthereumContract();
  //const options = {value: ethers.utils.parseEther(tokens)};
 try {
   await contract.dispatchRewards(customers, rewards);}
 catch(error){
   console.log(error)
  alert("only admins can call this function");
 }
}

const totalairdrop = async () => {
  try {
    if (ethereum) {
      const transactionsContract = createEthereumContract();
      await transactionsContract.totalSupply();

      // window.localStorage.setItem("transactionCount", currentTransactionCount);
    }
  } catch (error) {
    console.log(error);

    throw new Error("No ethereum object");
  }
}

const staketoken = async(tokens) => {
  const contract = createEthereumContract();
  await contract.createStake(tokens);
}

const unstaketoken = async(tokens) => {
  const contract = createEthereumContract();
  await contract.removeStake(tokens);
}

const claimtoken = async() => {
  const contract = createEthereumContract();
  await contract.claimReward();
}

const staked = async() => {
  const contract = createEthereumContract();
  const staked = await contract.stakeOf();
  return staked
}

const stakebalance = async(address) => {
  const contract = createEthereumContract();
  const balance = await contract.balanceOf(address);
  return balance
}


export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);
  // const [stakeAccount, setStakeAccount] = useState("");

//   // declare array for the loyal customer addresses
  const [customerAddresses, setcustomerAddresses] = useState([]);
  // declare array for their rewards
 const [reward, setreward] = useState([]);
//   // a boolean state to allow that only one of upload file button and airdrop token buttons show at a time
  const [isFileUpload, setisFileUpload] = useState(false);
  
  
  
//  // function to convert csv file from input file to arr, it receives a str paramater
  const csvToArray = (str) => {
   // split arrays the file according to \n newline regex
  const firstArr = str.split("\n");
    // mapping over the array to create a second arr
    let secondArr = firstArr.map((item)=>{
     return item.split(',');
    })
 // secondArr=[[address, reward],[address, reward] etc]
// console.log(secondArr)
    
 // mapping over the secondArr to get a distinct arr of address
    const address = secondArr.map((item) => item[0] // [addresses]
)
  // mapping over the secondArr to get a distinct arr of rewards and returning it
    const values = secondArr.map((item) => {
  
    return item[1]; // [rewards]
})
//   console.log(JSON.stringify(values))
//     console.log(JSON.stringify(address))
    // updating secondArr before returning
  secondArr = [address, values];  // secondArr=[[addresses],[rewards]]
  return secondArr;
  }
  
//   // function to handle uploading file and getting initial readings
  
  // const handleChange = (e) => {
  //   console.log("hi")
  //   //setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  // };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }));

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

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

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
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

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: parsedAmount._hex,
          }],
        });

        const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = await transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
    totalairdrop();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        formData,
        buytoken,
        airdropTokens,
        staketoken,
        unstaketoken,
        claimtoken,
        staked,
        totalairdrop,
        stakebalance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
