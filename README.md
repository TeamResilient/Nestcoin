# NestCoin Rewards Dapp

> ## Table of contents
- [Overview](#overview)
- [Project Features](#project-features)
- [Technologies](#technologies)
- [Repo Setup](#repo-setup)
- [Requirements](#requirements)
- [Setup the Project](#setup-the-project)
  - [Install Hardhat](#install-hardhat)
  - [Env Setup](#env-setup)
  - [Setup Hardhat.config](#setup-hardhatconfig)
- [Create the SmartContract](#create-the-smartcontract)
  - [Compile](#compile)
  - [Deploy](#deploy)
  - [Verify](#verify)
- [Setup the Frontend](#setup-the-frontend)
  - [Install Dependencies](#install-dependencies)
  - [Start Server](#start-server)
  - [Build the Frontend](#build-the-frontend)
- [Testing the Smartcontract](#testing-the-smartcontract)
  - [Coverage](#coverage)
  - [Test](#test)
- [Verified Contract Addresses](#verified-contract-addresses)
- [Live Link](#live-link)
- [Contributors](#contributors)
- [Contributing to the project](#contributing-to-the-project)
#
> ## Overview
<p align="justify">
Nestcoin is a filmhouse that would like to further engage with their audience. They would like to create a currency which would be used to reward loyal customers. The curremcy would later be traded for backstage passes and other perks.

Interestingly they began accepting crypto-based payments a year ealiers and would like to harness the power of Web3 to implement their solution.
</p>

#
> ## Project Features

- Batch transfer rewards to a maximum of 200 addresses.

- Distribute currency as quickly and effeciently as possible

</p>

#
> ## Technologies
| <b><u>Stack</u></b> | <b><u>Usage</u></b> |
| :------------------ | :------------------ |
| **`Solidity`**      | Smart contract      |
| **`React JS`**      | Frontend            |

#
> ## Repo Setup

<p align="justify">
To setup the repo, first fork the TeamResilient Nestcoin repo, then clone the forked repository to create a copy on the local machine.
</p>

    $ git clone https://github.com/pauline-banye/Nestcoin.git

<p align="justify">
Change directory to the cloned repo and set the original Nestcoin repository as the "upstream" and your forked repository as the "origin" using gitbash.
</p>

    $ git remote add upstream https://github.com/TeamResilient/Nestcoin.git

#

> ## Requirements
#
- Hardhat
- Alchemy key
- Metamask key
- Etherscan.io API Url
- Node JS
#
> ## Setup the Project
### \*Note:

- This project was setup on a windows 10 system using the gitbash terminal. Some of the commands used may not work with the VScode terminal, command prompt or powershell.

- The steps involved are outlined below:-
#
> ### Install Hardhat
The first step involves cloning and installing hardhat.
```shell
$ cd Nestcoin

$ npm i -D hardhat

$ npm install

# Delete the old package-lock.json

$ npm install --save-dev "@nomiclabs/hardhat-waffle" "ethereum-waffle" "chai" "@nomiclabs/hardhat-ethers" "ethers" "web3" "@nomiclabs/hardhat-web3" "@nomiclabs/hardhat-etherscan" "@openzeppelin/contracts" "dotenv"
```
> ### Env Setup
 Next create a '.env' file by using the sample.env. Retrieve your information from the relevant sites and input the information where needed in the .env file.

`To retrieve your metamask private key.`
- Open your account details by clicking on the three dots on the metamask extension on your chrome browser
- Click on export private key
- Verify your password
- Copy your private key and place it in the .env file

<p align="center" width="100%">
  <img src="https://drive.google.com/uc?export=view&id=1oDl0IbicD7LhNOcYUbGzBYTJdduWim1t" alt="metamask"/>
</p>

#
`To retrieve your alchemy key.`
- Login to your account on https://www.alchemy.com/
- Once youre redirected to your [dashboard](https://dashboard.alchemyapi.io/), click on create app.
- Fill in the relevant details especially the chain and network
- Once the app has been created, click on view key.
- Copy the HTTP and place it in the .env file.


<p align="center" width="100%">
  <img src="https://drive.google.com/uc?export=view&id=1XFtACFN-LWvoDUD1QyJJY9uOc7KNkrL6" alt="alchemy"/>
</p>

#
`To retrieve your etherscan key.`
- Login to [etherscan](https://etherscan.io/) and hover over the dropdown arrow for your profile on the navbar.
- Click on API keys and add to create a new project (optional step).
- Once the project has been created, click on the copy button to copy the API key.
- Paste it in the .env file

<p align="center" width="100%">
  <img src="https://drive.google.com/uc?export=view&id=1Gq-hPuwjwb3TOCH2dqUA93VxfyrbUDN6" alt="etherscan key"/>
</p>

#
> ### Setup Hardhat.config


Below is the setup for the hardhat.config.json

<p align="center" width="100%">
  <img src="https://drive.google.com/uc?export=view&id=1Wmc2o2DnF5K6Q5y0CTCjVUfUIoLVm2ei" alt="hardhat"/>
</p>

#
> ## Create the SmartContract
  - First write the Smartcontract codes within the contracts folder.
  - The next step involves the compilation, deployment and verification of the contract on the testnet.

> ### Compile
- To compile the smartcontract before deployment:
```
$ npx hardhat compile
```
#
> ### Deploy
- To deploy the smartcontract:
```
$ npx hardhat run scripts/deploy.js --network rinkeby
```
#
> ### Verify
- To verify the smartcontract:
```
$ npx hardhat verify 0x43f71fbd58e9600924f49a53c6fde787977c2b9d --network rinkeby "0x33d57e4712e4c4dc6ff50e3319e1e79d7eabc937"
```
Note* - the first contract written after verify in the code is the `Nestdrop.sol` address recieved after the deployment while the second contract after rinkeby is the `Nestcoin.sol` address
#
> ## Setup the Frontend
- First run the frontend on your local server to ensure it's fully functional before building for production.
#
> ### Install Dependencies
- Setup and install dependencies

```shell
$ cd frontend

$ npm install

$ npm install react-scripts@latest
```
#
> ### Start Server
- Start the server on localhost
```
$ npm run start
```
#
> ### Build the Frontend
- Create an optimized production build, which can be hosted on sites like Heroku, Netlify, Surge etc.
```
$ npm run build
```
#
> ## Testing the Smartcontract

- Coverage was used to view the extent of our tests and unittests were implemented to ensure that the code functions as expected
#
> ### Coverage
- Install Solidity Coverage
```
  $ npm i solidity-coverage
```
- Add `require('solidity-coverage')` to hardhat.config.json

- Install Ganache
``` 
  $ npm i install ganache-cli
``` 
- Run coverage
```
$ npx hardhat coverage --network localhost
```
#
> ### Test

- To test the smartcontract, first open a terminal and run the following command:

``` 
$ npx hardhat node
```
- Leave the previous terminal running and open new terminal. 
- Run the command below:
```
$ npx hardhat test --network localhost
``` 
#
> ## Verified Contract Addresses

- The NestDrop Contract Address 

  https://rinkeby.etherscan.io/address/0x43f71fbd58e9600924f49a53c6fde787977c2b9d#code


- The NestCoin Contract Address

  https://rinkeby.etherscan.io/address/0x33d57e4712e4c4dc6ff50e3319e1e79d7eabc937#code
  
> ## Live Link
  
  - https://resilentcinema.netlify.app/
#

> ## Contributors

This Project was created by the members of TeamResilient during the Blockgames Internship.

<p align="center" width="100%">
  <img src="https://drive.google.com/uc?export=view&id=10Ibk5J441crY7Dh4DVPVM5bwx0JenaRL" alt="teamresilient"/>
</p>

#
> ## Contributing to the project

If you find something worth contributing, please fork the repo, make a pull request and add valid and well-reasoned explanations about your changes or comments.

Before adding a pull request, please note:

- This is an open source project.
- Your contributions should be inviting and clear.
- Any additions should be relevant.
- New features should be easy to contribute to.

All **`suggestions`** are welcome!
#
> ###### README Created by `Pauline Banye` for TeamResilient
