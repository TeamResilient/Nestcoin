import React from "react";
import { SocialIcon } from "react-social-icons"; 

import logo from "../../images/icon.png";

const Footer = () => (
  <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
    <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
      <div className="flex flex-[0.5] justify-center items-center">
        <img src={logo} alt="logo" className="w-32" />
      </div>
     
    </div>
    <div className="sm:w-[70%] w-full h-[0.25px] bg-gray-400 mt-5 " />

    <div className="sm:w-[70%] w-full h-[0.25px] flex justify-between items-center mt-3">
      <p className="text-white text-left text-xs">©NestCoin2022</p>
      <p className="text-white text-right text-xs">All rights reserved</p>
    </div>
  </div>
);

export default Footer;
