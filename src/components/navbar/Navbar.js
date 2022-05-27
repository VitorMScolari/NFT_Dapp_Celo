import React from 'react'
import { Link } from "react-router-dom";
import { Container, Nav } from "react-bootstrap";
import Cover from "../minter/Cover";
import Wallet from "../Wallet";
import {useContractKit} from "@celo-tools/use-contractkit";
import { useBalance } from "../../hooks";
import { Notification } from "../ui/Notifications";


 const Navbar = () => {

     const {address, destroy, connect} = useContractKit();
     const { balance, setBalance } = useBalance();

     return (
         <div className='navbar'>
            <Nav className="navbar-links">
                <div className="navbar-links_logo">
                    <Link to="/">
                        <h1>Explore</h1>
                    </Link>
                </div>
                <div className="navbar-links_container">          
                    <Link  className='stuff'  to="/profile">  <p>My NFTs</p></Link>
                    <Link to="/create">
                        <p>Mint your NFT's</p>
                    </Link>
                </div>
            </Nav>
            <div className="navbar-sign">
                <Notification />
                {address ? (
                <Container fluid="md">
                    <Nav className="justify-content-end pt-3 pb-5">
                        <Nav.Item>
                        <Wallet
                            address={address}
                            amount={balance.CELO}
                            symbol="CELO"
                            destroy={destroy}
                        />
                        </Nav.Item>
                    </Nav>
                </Container>
                ) : (
                    <Cover name="VMS Market" connect={connect} />
                )}
            </div>
         </div>
     )
}

export default Navbar
