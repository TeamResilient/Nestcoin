# NestCoin Rewards Dapp

> ## Table of contents

- [Overview](#overview)
- [Project Features](#project-features)
- [Technologies](#technologies)
- [Repo Setup](#repo-setup)
- [Requirements](#requirements)
- [Setting up the project](#setting-up-the-project)
  - [Install hardhat](#install-hardhat)
  - [Env setup](#env-setup)
  - [Setup hardhat.config](#setup-hardhatconfig)
  - [Compile](#compile)
  - [Deploy](#deploy)
  - [Verify](#verify)
  - [Test](#test)
- [Verified Contract Address](#verified-contract-address)

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

> ## Setting up the project

### \*Note:

- This project was setup on a windows 10 system using the gitbash terminal. Some of the commands used may not work with the VScode terminal, command prompt or powershell.

- The steps involved are outlined below:-

#

> ### Install hardhat

The first step involves cloning and installing hardhat.

```shell
$ git clone https://github.com/TeamResilient/Nestcoin.git

$ cd Nestcoin

$ npm i -D hardhat

$ npx hardhat

$ yarn install

$ npm install --save-dev "@nomiclabs/hardhat-waffle" "ethereum-waffle" "chai" "@nomiclabs/hardhat-ethers" "ethers" "web3" "@nomiclabs/hardhat-web3" "@nomiclabs/hardhat-etherscan" "@openzeppelin/contracts" "dotenv"
```

> ### Env setup
>
> Next create a '.env' file by using the sample.env. Retrieve your information from the relevant sites and input the information where needed in the .env file.

`To retrieve your metamask private key.`

- Open your account details by clicking on the three dots on the metamask extension on your chrome browser
- Click on export private key
- Verify your password
- Copy your private key and place it in the .env file

![metamask](https://drive.google.com/uc?export=view&id=1oDl0IbicD7LhNOcYUbGzBYTJdduWim1t)

#

`To retrieve your alchemy key.`

- Login to your account on https://www.alchemy.com/
- Once youre redirected to your [dashboard](https://dashboard.alchemyapi.io/), click on create app.
- Fill in the relevant details especially the chain and network
- Once the app has been created, click on view key.
- Copy the HTTP and place it in the .env file.

![alchemy](https://drive.google.com/uc?export=view&id=1XFtACFN-LWvoDUD1QyJJY9uOc7KNkrL6)

#

`To retrieve your etherscan key.`

- Login to [etherscan](https://etherscan.io/) and hover over the dropdown arrow for your profile on the navbar.
- Click on API keys and add to create a new project (optional step).
- Once the project has been created, click on the copy button to copy the API key.
- Paste it in the .env file

![etherscan](https://drive.google.com/uc?export=view&id=1Gq-hPuwjwb3TOCH2dqUA93VxfyrbUDN6)

#

> ### Setup hardhat.config
>
> Below is the setup for the hardhat.config.json

![hardhat](https://drive.google.com/uc?export=view&id=1Wmc2o2DnF5K6Q5y0CTCjVUfUIoLVm2ei)

#

> ### Compile

- compile the smartcontract before deployment:

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
$ npx hardhat verify DEPLOYED_ADDRESS --network rinkeby
```


#
> ### Test
- To test the smartcontract: 
```
$ npx hardhat test --network localhost
```

#
> ## Verified Contract Address: 
https://rinkeby.etherscan.io/address/0x287afff0dc95f8aa23608819912ce50ba2631c32#code

#
> ## Coverage Test: 
$ npm i install ganache-cli 
$ npx hardhat coverage --network localhost 


