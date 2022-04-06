# NestCoin Rewards Dapp

> ## Table of contents

- [Overview](#overview)
- [Project Features](#project-features)
- [Technologies](#technologies)
- [Repo Setup](#repo-setup)
- [Requirements](#requirements)
- [Setting up the project](#setting-up-the-project)
  - [Hardhat setup for backend](#hardhat-setup-for-backend)
  - [Compile](#compile)
  - [Deploy](#deploy)
  - [Verify](#verify)
- [Verified Contract Address](#verified-contract-address)

#

> ## Overview

<p align="justify">
Nestcoin is a filmhouse that would like to further engage with their audience. They would like to create a currency which would be used to reward loyal customers. The curremcy would later be traded for backstage passes and other perks.

Interestingly they began accepting crypto-based payments a year ealiers and would like to harness the power of Web3 to implement their solution.
</p>

#

> ## Project Features
>
- Batch transfer rewards to a miximum of 200 addresses.

- Distribute currency as quickly and effeciently as possible

</p>

#

> ## Technologies

| <b><u>Stack</u></b>          | <b><u>Usage</u></b>   |
| :--------------------------- | :-------------------- |
| **`Solidity`**             | Smart contract |
| **`React JS`**               | Frontend              |


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
> ## Setting up the project
### \*Note:

- This project was setup on a windows 10 system using the gitbash terminal. Some of the commands used may not work with the VScode terminal, command prompt or powershell.

- The steps involved are outlined below:-
#

### Hardhat setup


- first steps involve cloning and installing hardhat
```shell
$ git clone https://github.com/TeamResilient/Nestcoin.git

$ cd Nestcoin

$ npm i -D hardhat

$ npx hardhat

$ yarn install

$ npm install --save-dev "@nomiclabs/hardhat-waffle" "ethereum-waffle" "chai" "@nomiclabs/hardhat-ethers" "ethers" "web3" "@nomiclabs/hardhat-web3" "@nomiclabs/hardhat-etherscan" "@openzeppelin/contracts" "dotenv"
```
- setup an .env file by using the sample.env 

- retrieve alchemy, metamask & etherscan keys and setup hardhat.config
#
### Compile
- compile the smartcontract before deployment: 
```
$ npx hardhat compile
```
#
### Deploy
- To deploy: 
```
$ npx hardhat run scripts/deploy.js --network rinkeby
```
#
### Verify
- To verify smartcontract: 
```
$ npx hardhat verify DEPLOYED_ADDRESS --network rinkeby
```
#
> ## Verified Contract Address: 
https://rinkeby.etherscan.io/address/0x9DC7331249dd5E9474E9da1d747537D0075561Ba#code