import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

export default function ExampleUI({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [newPurpose, setNewPurpose] = useState("loading...");

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Admin Dashboard</h2>
        <h4>Mint Token, Set Perk Rate, & Reward Loyal Customers</h4>
        {/* @WumiDev Mint Token */}
        <Divider />
        <div style={{ margin: 8 }}>
          <Input
          style={{ textAlign: "center" }}
            onChange={e => {
              setNewPurpose(e.target.value);
            }}
            placeholder={"amount of tokens to mint"}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = tx(writeContracts.YourContract.setPurpose(newPurpose), update => {
                console.log("📡 Transaction Update:", update);
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Mint Token
          </Button>
        </div>
        {/* @WumiDev Set Perk Rate */}
        <Divider />
        <div style={{ margin: 8 }}>
          <Input
          style={{ textAlign: "center" }}
            onChange={e => {
              setNewPurpose(e.target.value);
            }}
            placeholder={"amount of tokens for a perk"}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = tx(writeContracts.YourContract.setPurpose(newPurpose), update => {
                console.log("📡 Transaction Update:", update);
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Set Perk Rate
          </Button>
        </div>
        <Divider />

        {/* @wumidev Reward Loyal Customers */}
                <div style={{ padding: 8, marginTop: 32, margin: "auto" }}>
                <Card title="Transfer tokens">
                <div>
                    <div style={{ padding: 8 }}>
                    <Input
                        // ensProvider={mainnetProvider}
                        placeholder="upload cvs"
                        // value={tokenSendToAddress}
                        // onChange={setTokenSendToAddress}
                    />
                    </div>
                   
                </div>
                <div style={{ padding: 8 }}>
                    <Button
                    type={"primary"}
                    // onClick={() => {
                    //     tx(
                    //     writeContracts.YourToken.transfer(tokenSendToAddress, ethers.utils.parseEther("" + tokenSendAmount)),
                    //     );
                    // }}
                    >
                    Reward Loyal Customers
                    </Button>
                </div>
                </Card>
            </div>
            );

{/* @wumidev the following are not required for now */}
{/*  */}
    </div>
    </div>
  );

