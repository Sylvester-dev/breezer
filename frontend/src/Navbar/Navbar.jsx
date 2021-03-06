import React from "react";
import * as icon from "./favicon.gif";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <div className="container">
        <img src={icon} alt="" style={{width:"5%", height:"5%"}} />
        <Link to="/" className="navbar-brand ml-2">
          NFT's
        </Link>
        <button
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="navbarNav" className="collapse navbar-collapse">
          <ul
            style={{ fontSize: "0.8rem", letterSpacing: "0.2rem" }}
            className="navbar-nav ml-auto"
          >
            
            <li className="nav-item">
              <Link to="/mint" className="nav-link">
                Mint FARM
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/mint_medical" className="nav-link">
                Mint Medicine
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/marketplace" className="nav-link">
                Farm Marketplace
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link to="/my-tokens" className="nav-link">
                My Tokens
              </Link>
            </li> */}
            <li className="nav-item">
              <Link to="/medical" className="nav-link">
                Medicine Marketplace
              </Link>
            </li> 
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
