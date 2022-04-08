import Portis from "@portis/web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Upload, Alert, Button, Card, Col, Divider, Input, List, Menu, Row, message } from "antd";
import "antd/dist/antd.css";
import Authereum from "authereum";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import { useEventListener } from "eth-hooks/events/useEventListener";
import Fortmatic from "fortmatic";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
//import Torus from "@toruslabs/torus-embed"
import WalletLink from "walletlink";
import Web3Modal from "web3modal";
import "./App.css";
import { Account, Address, Balance, Faucet, GasGauge, Header, Ramp, ThemeSwitch } from "./components";
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";
import { Transactor } from "./helpers";

// contracts
import externalContracts from "./contracts/external_contracts";
import deployedContracts from "./contracts/hardhat_contracts.json";
import uniqid from "uniqid";
import * as XLSX from "xlsx";

const formatDate = epochTime => {
  const date = new Date(epochTime * 1000);
  const dateArray = date.toString().split(" ");

  return `${dateArray[1]} ${dateArray[2]}, ${dateArray[3]}. ${dateArray[4]}`;
};

const { ethers } = require("ethers");
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.rinkeby; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544")
  : null;
const poktMainnetProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider(
      "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
    )
  : null;
const mainnetInfura = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
  : null;
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

// Coinbase walletLink init
const walletLink = new WalletLink({
  appName: "coinbase",
});

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(`https://mainnet.infura.io/v3/${INFURA_ID}`, 1);

// Portis ID: 6255fb2b-58c8-433b-a2c9-62098c05ddc9
/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
  cacheProvider: true, // optional
  theme: "light", // optional. Change to "dark" for a dark theme.
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        bridge: "https://polygon.bridge.walletconnect.org",
        infuraId: INFURA_ID,
        rpc: {
          1: `https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
          42: `https://kovan.infura.io/v3/${INFURA_ID}`,
          100: "https://dai.poa.network", // xDai
        },
      },
    },
    portis: {
      display: {
        logo: "https://user-images.githubusercontent.com/9419140/128913641-d025bc0c-e059-42de-a57b-422f196867ce.png",
        name: "Portis",
        description: "Connect to Portis App",
      },
      package: Portis,
      options: {
        id: "6255fb2b-58c8-433b-a2c9-62098c05ddc9",
      },
    },
    fortmatic: {
      package: Fortmatic, // required
      options: {
        key: "pk_live_5A7C91B2FC585A17", // required
      },
    },
    // torus: {
    //   package: Torus,
    //   options: {
    //     networkParams: {
    //       host: "https://localhost:8545", // optional
    //       chainId: 1337, // optional
    //       networkId: 1337 // optional
    //     },
    //     config: {
    //       buildEnv: "development" // optional
    //     },
    //   },
    // },
    "custom-walletlink": {
      display: {
        logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
        name: "Coinbase",
        description: "Connect to Coinbase Wallet (not Coinbase App)",
      },
      package: walletLinkProvider,
      connector: async (provider, _options) => {
        await provider.enable();
        return provider;
      },
    },
    authereum: {
      package: Authereum, // required
    },
  },
});

function App(props) {
  const mainnetProvider =
    poktMainnetProvider && poktMainnetProvider._isProvider
      ? poktMainnetProvider
      : scaffoldEthProvider && scaffoldEthProvider._network
      ? scaffoldEthProvider
      : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);

  const nestcoinAddress = readContracts && readContracts.NestCoin && readContracts.NestCoin.address;

  const nestcoinETHBalance = useBalance(localProvider, nestcoinAddress);
  if (DEBUG)
    console.log("💵 nestcoinETHBalance", nestcoinETHBalance ? ethers.utils.formatEther(nestcoinETHBalance) : "...");

  const nestcoinApproval = useContractReader(readContracts, "NestCoin", "allowance", [address, nestcoinAddress]);
  console.log("🤏 nestcoinApproval", nestcoinApproval);

  const nestcoinTotalSupply = useContractReader(readContracts, "NestCoin", "totalSupply", []);
  console.log("🏵 nestcoinTotalSupply:", nestcoinTotalSupply ? ethers.utils.formatEther(nestcoinTotalSupply) : "...");

  const nestcoinTokenBalance = useContractReader(readContracts, "NestCoin", "balanceOf", [nestcoinAddress]);
  console.log("🏵 nestcoinTokenBalance:", nestcoinTokenBalance ? ethers.utils.formatEther(nestcoinTokenBalance) : "...");

  const yourNestCoinBalance = useContractReader(readContracts, "NestCoin", "balanceOf", [address]);
  console.log("🏵 yourTokenBalance:", yourNestCoinBalance ? ethers.utils.formatEther(yourNestCoinBalance) : "...");

  const tokensPerEth = useContractReader(readContracts, "NestCoin", "tokensPerEth");
  console.log("🏦 tokensPerEth:", tokensPerEth ? tokensPerEth.toString() : "...");

  // const complete = useContractReader(readContracts,"ExampleExternalContract", "completed")
  // console.log("✅ complete:",complete)
  //
  // const exampleExternalContractBalance = useBalance(localProvider, readContracts && readContracts.ExampleExternalContract.address);
  // if(DEBUG) console.log("💵 exampleExternalContractBalance", exampleExternalContractBalance )

  // let completeDisplay = ""
  // if(false){
  //   completeDisplay = (
  //     <div style={{padding:64, backgroundColor:"#eeffef", fontWeight:"bolder"}}>
  //       🚀 🎖 👩‍🚀  -  Staking App triggered `ExampleExternalContract` -- 🎉  🍾   🎊
  //       <Balance
  //         balance={0}
  //         fontSize={64}
  //       /> ETH staked!
  //     </div>
  //   )
  // }

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
  ]);

  let networkDisplay = "";
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network ID"
            description={
              <div>
                You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
                HardHat.
                <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    } else {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network"
            description={
              <div>
                You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
                <Button
                  onClick={async () => {
                    const ethereum = window.ethereum;
                    const data = [
                      {
                        chainId: "0x" + targetNetwork.chainId.toString(16),
                        chainName: targetNetwork.name,
                        nativeCurrency: targetNetwork.nativeCurrency,
                        rpcUrls: [targetNetwork.rpcUrl],
                        blockExplorerUrls: [targetNetwork.blockExplorer],
                      },
                    ];
                    console.log("data", data);

                    let switchTx;
                    // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
                    try {
                      switchTx = await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: data[0].chainId }],
                      });
                    } catch (switchError) {
                      // not checking specific error code, because maybe we're not using MetaMask
                      try {
                        switchTx = await ethereum.request({
                          method: "wallet_addEthereumChain",
                          params: data,
                        });
                      } catch (addError) {
                        // handle "add" error
                      }
                    }

                    if (switchTx) {
                      console.log(switchTx);
                    }
                  }}
                >
                  <b>{networkLocal && networkLocal.name}</b>
                </Button>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  let faucetHint = "";
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId === 31337 &&
    yourLocalBalance &&
    ethers.utils.formatEther(yourLocalBalance) <= 0
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: address,
              value: ethers.utils.parseEther("1"),
            });
            setFaucetClicked(true);
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }

  const Dispatched = useEventListener(readContracts, "NestCoin", "airdrop", localProvider, 1);
  const paymentEvents = useEventListener(readContracts, "NestCoin", "Payment", localProvider, 1);

  console.log("📟 Dispatched:", Dispatched);

  const [tokenBuyAmount, setTokenBuyAmount] = useState({
    valid: false,
    value: "",
  });
  const [paymentAmount, setPaymentAmount] = useState({
    valid: false,
    value: "",
  });
  const [paymentRef, setPaymentRef] = useState("");
  const [isPaymentAmountApproved, setIsPaymentAmountApproved] = useState();

  useEffect(() => {
    console.log("paymentAmount", paymentAmount.value);
    const paymentAmountBN = paymentAmount.valid ? ethers.utils.parseEther("" + paymentAmount.value) : 0;
    console.log("paymentAmountBN", paymentAmountBN);
    setIsPaymentAmountApproved(nestcoinApproval && paymentAmount.value && nestcoinApproval.gte(paymentAmountBN));
  }, [paymentAmount, readContracts]);
  console.log("isPaymentAmountApproved", isPaymentAmountApproved);

  const ethCostToPurchaseTokens =
    tokenBuyAmount.valid &&
    tokensPerEth &&
    ethers.utils.parseEther("" + tokenBuyAmount.value / parseFloat(tokensPerEth));
  console.log("ethCostToPurchaseTokens:", ethCostToPurchaseTokens);

  const ethValueToSellTokens =
    paymentAmount.valid && tokensPerEth && ethers.utils.parseEther("" + paymentAmount.value / parseFloat(tokensPerEth));
  console.log("ethValueToSellTokens:", ethValueToSellTokens);

  const [tokenSendToAddress, setTokenSendToAddress] = useState();
  const [tokenSendAmount, setTokenSendAmount] = useState();

  const [tokenTransfering, setTokenTransfering] = useState();
  const [paying, setPaying] = useState();
  const [editingAccess, setEditingAccess] = useState();

  const [addresses, setAddresses] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [customersCsvFile, setCustomersCsvFile] = useState([]);

  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

    // const list = [];
    const csvAddresses = [];
    const csvAmounts = [];
    let csvTotals = 0;
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          // list.push(obj);
          csvAddresses.push(obj["address"]);

          csvAmounts.push(ethers.utils.parseEther(obj["amount"]));
          csvTotals += Number(obj["amount"]);
        }
      }
    }
    if (csvAddresses.length > 200) {
      message.info("You have more than 200. It should be atmost 200 per batch");
      setCustomersCsvFile([]);
      return;
    }

    setAddresses(csvAddresses);
    setAmounts(csvAmounts);
    setTotalAmount(ethers.utils.parseEther(`${csvTotals}`));
  };

  const handleChange = ({ fileList }) => {
    setCustomersCsvFile(fileList);

    // Parse through CSV files
    if (fileList.length === 0) {
      setAddresses([]);
      setAmounts([]);
      setTotalAmount(0);

      return;
    }

    const file = fileList[0].originFileObj;
    const reader = new FileReader();
    reader.onload = evt => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  const [addressToCheckBalance, setAddressToCheckBalance] = useState("");
  const [addressToEditAccess, setAddressToEditAccess] = useState("");
  const [isAddressAdmin, setIsAddressAdmin] = useState("");

  const [balanceCheckAmount, setBalanceCheckAmount] = useState(0);

  const handleCheckBalance = async () => {
    if (addressToCheckBalance) {
      setBalanceCheckAmount(await tx(readContracts.NestCoin.balanceOf(addressToCheckBalance)));
    }
  };

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}
      <BrowserRouter>
        <Menu style={{ textAlign: "center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute("/");
              }}
              to="/"
            >
              Admin Portal
            </Link>
          </Menu.Item>
          <Menu.Item key="/customerPortal">
            <Link
              onClick={() => {
                setRoute("/customerPortal");
              }}
              to="/customerPortal"
            >
              Customer Portal
            </Link>
          </Menu.Item>
          <Menu.Item key="/access">
            <Link
              onClick={() => {
                setRoute("/access");
              }}
              to="/access"
            >
              Access Control
            </Link>
          </Menu.Item>
        </Menu>

        <Switch>
          <Route exact path="/">
            <Divider />
            <div style={{ padding: 8, marginTop: 32, width: 300, margin: "auto" }}>
              <Card title="Reward Loyal Customers">
                <div style={{ padding: 8 }}>
                  <Upload
                    accept=".csv,.xlsx,.xls"
                    action="#"
                    listType="picture-card"
                    fileList={customersCsvFile}
                    onChange={handleChange}
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    {customersCsvFile.length === 0 && (
                      <div>
                        <div style={{ marginTop: 8 }}>Upload csv</div>
                      </div>
                    )}
                  </Upload>
                  {/* <Input
                    style={{ textAlign: "center" }}
                    placeholder={"amount of tokens to buy"}
                    value={tokenBuyAmount.value}
                    onChange={e => {
                      const newValue = e.target.value.startsWith(".") ? "0." : e.target.value;
                      const buyAmount = {
                        value: newValue,
                        valid: /^\d*\.?\d+$/.test(newValue),
                      };
                      setTokenBuyAmount(buyAmount);
                    }}
                  /> */}
                  <Balance balance={totalAmount} /> NCT <div>{totalAmount ? `to ${addresses.length} loyal customers` : ''}</div>
                </div>

                <div style={{ padding: 8 }}>
                  <Button
                    type={"primary"}
                    loading={tokenTransfering}
                    onClick={async () => {
                      setTokenTransfering(true);
                      await tx(writeContracts.Nestdrop.airdrop(addresses, amounts));
                      setTokenTransfering(false);
                      setCustomersCsvFile([]);
                    }}
                    disabled={customersCsvFile.length === 0}
                  >
                    Airdrop Tokens
                  </Button>
                </div>
              </Card>
            </div>

            <div style={{ padding: 8, marginTop: 32 }}>
              <div>Total Supply:</div>
              <Balance balance={nestcoinTotalSupply} fontSize={64} /> NCT
            </div>
            {/* <div style={{ padding: 8 }}>
             {/* <div>NestCoin Exchange Balance:</div> 
              <Balance balance={nestcoinTokenBalance} fontSize={64} /> NCT
            </div> */}

            <Divider />
            <div style={{ padding: 8, marginTop: 32, width: 300, margin: "auto" }}>
              <Card title="Balance Check">
                <div style={{ padding: 8 }}>
                  <Input
                    type="text"
                    style={{ textAlign: "center" }}
                    placeholder={"Address"}
                    value={addressToCheckBalance}
                    onChange={e => {
                      setAddressToCheckBalance(e.target.value);
                    }}
                  />
                  <Balance balance={balanceCheckAmount} /> NCT
                </div>

                <div style={{ padding: 8 }}>
                  <Button
                    type={"primary"}
                    loading={tokenTransfering}
                    onClick={handleCheckBalance}
                    disabled={!addressToCheckBalance}
                  >
                    Check Balance
                  </Button>
                </div>
              </Card>
            </div>

            <div style={{ width: 500, margin: "auto", marginTop: 64 }}>
              <div>Dispatched:</div>
              <List
                dataSource={Dispatched}
                renderItem={item => {
                  return (
                    <List.Item key={item.blockNumber + item.blockHash}>
                      <Address value={item.args[0]} ensProvider={mainnetProvider} fontSize={16} />
                      &nbsp;&nbsp;
                      Batch transfered &nbsp;&nbsp;
                      <Balance balance={item.args[1]} />
                      NCT
                    </List.Item>
                  );
                }}
              />
            </div>
          </Route>
          <Route path="/customerPortal">
            <Divider />
            <div style={{ padding: 8, marginTop: 32, width: 300, margin: "auto" }}>
              <Card title="Pay with NestCoin">
                <div style={{ padding: 8 }}>
                  <Input
                    style={{ textAlign: "center" }}
                    placeholder={"amount of tokens to pay with"}
                    value={paymentAmount.value}
                    onChange={e => {
                      const newValue = e.target.value.startsWith(".") ? "0." : e.target.value;
                      const payAmount = {
                        value: newValue,
                        valid: /^\d*\.?\d+$/.test(newValue),
                      };
                      setPaymentAmount(payAmount);
                      setPaymentRef(uniqid())
                    }}
                  />
                </div>
                <div style={{ padding: 8 }}>
                  <Input type="text" style={{ textAlign: "center" }} placeholder={"Ref"} value={paymentRef} disabled/>
                </div>
                {isPaymentAmountApproved ? (
                  <div style={{ padding: 8 }}>
                    <Button disabled={true} type={"primary"}>
                      Approve Tokens
                    </Button>
                    <Button
                      type={"primary"}
                      loading={paying}
                      onClick={async () => {
                        setPaying(true);
                        await tx(
                          writeContracts.Nestdrop.pay(
                            paymentAmount.valid && ethers.utils.parseEther(paymentAmount.value),
                            ethers.utils.formatBytes32String(paymentRef),
                          ),
                        );
                        setPaying(false);
                        setPaymentAmount("");
                      }}
                      disabled={!paymentAmount.valid}
                    >
                      Pay
                    </Button>
                  </div>
                ) : (
                  <div style={{ padding: 8 }}>
                    <Button
                      type={"primary"}
                      loading={paying}
                      onClick={async () => {
                        setPaying(true);
                        await tx(
                          writeContracts.NestCoin.approve(
                            readContracts.Nestdrop.address,
                            paymentAmount.valid && ethers.utils.parseEther(paymentAmount.value),
                          ),
                        );
                        setPaying(false);
                        let resetAmount = paymentAmount;
                        setPaymentAmount("");
                        setTimeout(() => {
                          setPaymentAmount(resetAmount);
                        }, 1500);
                      }}
                      disabled={!paymentAmount.valid}
                    >
                      Approve Tokens
                    </Button>
                    <Button disabled={true} type={"primary"}>
                      Pay
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            <div style={{ padding: 8, marginTop: 32 }}>
              <div>Your NestCoin Balance:</div>
              <Balance balance={yourNestCoinBalance} fontSize={64} /> NCT
            </div>
            <div style={{ width: 500, margin: "auto", marginTop: 64 }}>
              <div>Payment Events:</div>
              <List
                dataSource={paymentEvents}
                renderItem={item => {
                  return (
                    <List.Item key={item.blockNumber + item.blockHash}>
                      <Address value={item.args[0]} ensProvider={mainnetProvider} fontSize={16} />
                      &nbsp;
                      <Balance balance={item.args[1]} />
                      NKT &nbsp;
                      <span>R({ethers.utils.parseBytes32String(item.args[2])})</span> &nbsp;&nbsp;
                      <span>T({formatDate(item.args[3])})</span>
                    </List.Item>
                  );
                }}
              />
            </div>
          </Route>
          <Route exact path="/access">
            <Divider />
            <div style={{ padding: 8, marginTop: 32, width: 300, margin: "auto" }}>
              <Card title="Grant/Revoke Admin Access">
                <div style={{ padding: 8 }}>
                  <Input
                    type="text"
                    style={{ textAlign: "center" }}
                    placeholder={"Address"}
                    value={addressToEditAccess}
                    onChange={async e => {
                      setAddressToEditAccess(e.target.value);
                      setIsAddressAdmin(await tx(readContracts.Nestdrop.assignAdmin(e.target.value)));
                    }}
                  />
                </div>

                {isAddressAdmin ? (
                  <div style={{ padding: 8 }}>
                    <Button disabled={true} type={"primary"}>
                      Grant
                    </Button>
                    <Button
                      type={"primary"}
                      loading={editingAccess}
                      onClick={async () => {
                        setEditingAccess(true);
                        await tx(writeContracts.NestCoin.removeAdmin(addressToEditAccess));
                        message.info("You are no longer Admin");
                        setEditingAccess(false);
                        setAddressToEditAccess("");
                      }}
                      disabled={!addressToEditAccess}
                    >
                      Revoke
                    </Button>
                  </div>
                ) : (
                  <div style={{ padding: 8 }}>
                    <Button
                      type={"primary"}
                      loading={editingAccess}
                      onClick={async () => {
                        setEditingAccess(true);
                        await tx(writeContracts.Nestdrop.addAdmin(addressToEditAccess));
                        message.info("You are now an Admin");
                        setEditingAccess(false);
                        setAddressToEditAccess("");
                      }}
                      disabled={!addressToEditAccess}
                    >
                      Grant
                    </Button>
                    <Button disabled={true} type={"primary"}>
                      Revoke
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </Route>
        </Switch>
      </BrowserRouter>

      <ThemeSwitch />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localProvider}
          userSigner={userSigner}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
        {faucetHint}
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} networks={NETWORKS} />
          </Col>

          <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
            <Button
              onClick={() => {
                window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              faucetAvailable ? (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
