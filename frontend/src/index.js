import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Navigation,
  Footer,
  Home,
  SendRewards,
  Admin,
  Customers,
  Posts,
  Post,
} from "./components";
import { TransactionsProvider } from "./context/TransactionContext";

ReactDOM.render(
  <TransactionsProvider>
  <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/SendRewards" element={<SendRewards />} />
      <Route path="/Admin" element={<Admin />} />
      <Route path="/Customers" element={<Customers />}>
        <Route path="" element={<Posts />} />
        <Route path=":postSlug" element={<Post />} />
      </Route>
    </Routes>
    <Footer />
  </Router>,
  </TransactionsProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
