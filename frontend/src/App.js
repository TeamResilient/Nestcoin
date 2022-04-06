import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
// @frontend team - this contract address is 0x579Ca32a74D2af3656110253C382F3a784C64409
function App() {
 
  // declare array for the loyal customer addresses
  const [customerAddresses, setcustomerAddresses] = useState([]);
  // declare array for their rewards
  const [reward, setreward] = useState([]);
  // a boolean state to allow that only one of upload file button and airdrop token buttons show at a time
  const [isFileUpload, setisFileUpload] =useState(false);
  
  // function to convert csv file from input file to arr, it receives a str paramater
  const csvToArray=(str)=> {
   // split arrays the file according to \n newline regex
  let firstArr = str.split('\n');
    //mapping over the array to create a second arr
    let secondArr = firstArr.map((item, index)=>{
     return item.split(',');
    })
 //secondArr=[[address, reward],[address, reward] etc]
//console.log(secondArr)
    
 //mapping over the secondArr to get a distinct arr of address
let address= secondArr.map((item) =>{
  
    return item[0]; //[addresses]
})
  //mapping over the secondArr to get a distinct arr of rewards and returning it
    let values= secondArr.map((item) =>{
  
    return item[1]; //[rewards]
})
//   console.log(JSON.stringify(values))
//     console.log(JSON.stringify(address))
    //updating secondArr before returning
  secondArr =[address, values]; //secondArr=[[addresses],[rewards]]
  return secondArr;
  }
  
  // function to handle uploading file and getting initial readings
  function handleFile (e) {
    e.preventDefault();
    //input file tag is is cvsFile
  const csvFile = document.getElementById("csvFile");
    const input = csvFile.files[0];
    
    //reading the file
    const reader = new FileReader();

   reader.onload = function (e) {
      const text = e.target.result;
     // calling our csvToArray(str) to convert to array
     //data here is like our secondArray earlier
      const data = csvToArray(text);
    
     //setisFileUpload to true as we've uploaded our file
     setisFileUpload(true);
     
     //update our customerAddresses array
     setcustomerAddresses(data[0]);
     
     //update our rewards array
     setreward(data[1]);

    };
    
    reader.readAsText(input);
  
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
//form to upload csv file alone
//you can customize the design as mine is basic for just testing
<form id="myForm">
  //this itenary ensures that only the option to upload file is shown prior to uploading file. It disappears after file has uploaded
{!isFileUpload && (
          <input type="file" id="csvFile" accept=".csv" onChange={handleFile}/>
        )}
        
    <br />
       //this itenary ensures that only the option to airdrop Token is not shown, until file has been uploaded.
        {isFileUpload && (
          <button onClick={airdropToken}>
            shareToken
          </button>
        )}
     
  </form>
    </div>
  );
}

export default App;
