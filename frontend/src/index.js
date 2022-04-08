import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { MoralisProvider } from "react-moralis"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MoralisProvider appId="loSlqaM2K4GWDlbSoq4IzXUjNAJOIVEWOMyr3UOn" serverUrl="https://febsjnqt3rfz.usemoralis.com:2053/server" >
    <App />
  </MoralisProvider>
);