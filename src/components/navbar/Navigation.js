import React from 'react'
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import {useContractKit} from "@celo-tools/use-contractkit";
import Create  from "../create/Create";
import './Navigation.css'


 const Navigation = () => {

     const {address, destroy, connect} = useContractKit();

     return (
         <>

            <div className="navbar-links-div">
                <Link to="/explore" className="navbar-links">
                    <h1 className="navbar-h1">Explore</h1>
                </Link>

                <Link to="/profile" className="navbar-links">
                    <h1 className="navbar-h1">My NFTs</h1>
                </Link>

                <Create />

                {!address ? (
                    <>
                        <Button type='button' onClick={connect} variant="outline-dark" className="navbar-btn rounded-pill px-5 m-1">Connect Wallet</Button>
                    </>
                ): (
                    <>
                        <Button type='button' onClick={destroy} variant="outline-dark" className="navbar-btn rounded-pill px-5 m-1">LOGOUT</Button>
                    </>
                )}
            </div>
         </>
     )
}

export default Navigation
