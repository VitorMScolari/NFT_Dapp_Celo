import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Nft from "../nfts/Card";
import Loader from "../ui/Loader";
import { Row } from "react-bootstrap";
import { useMarketContract } from "../../hooks/useMarketContract";
import { useMinterContract } from "../../hooks/useMinterContract";
import axios from "axios";
import {ethers} from "ethers";
import './Explore.css';
import {
    getNfts,
  } from "../../utils/minter";



const Explore = () => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);

    const marketContract = useMarketContract();
    const minterContract = useMinterContract();

    const getAssets = useCallback(async () => {
        try {
            /*
            setLoading(true);
            const data = await marketContract.methods.fetchMarketItems().call()
            console.log({data})
            const items = await Promise.all(data.map(async marketItem => {
                const tokenId = Number(marketItem.tokenId)
                const tokenURI = await marketContract.methods.tokenURI(tokenId).call()

                const seller = marketItem.seller
                const meta = await axios.get(tokenURI)
                let price = ethers.utils.formatUnits(marketItem.price.toString(), 'ether')

                return {
                    image: meta.data.image,
                    description: meta.data.description,
                    externalUrl: meta.data.externalUrl,
                    seller,
                    name: meta.data.name,
                    price,
                    tokenURI
                }
            }))
            setNfts(items);
            */            

            
            setLoading(true);
            const allNfts = await getNfts(minterContract);
            if (!allNfts) return;
            setNfts(allNfts);
            
        } catch (error) {
          console.log({ error });
        } finally {
          setLoading(false);
        }
      }, [minterContract]);


      useEffect(() => {
        try {
          if (marketContract) {
            getAssets();
          }
        } catch (error) {
          console.log({ error });
        }
      }, [marketContract, getAssets]);

    return (
        <div className="explore-div">
        {!loading ? (
            <>
            <Row xs={1} sm={2} lg={3} className="p-5">
                {nfts.map((_nft) => (
                <Nft
                    key={_nft.index}
                    nft={{
                    ..._nft,
                    }}
                />
                ))}
            </Row>
            </>
        ) : (
            <Loader />
        )}
        </div>
    );
    };
    

Explore.propTypes = {
    minterContract: PropTypes.instanceOf(Object)
 };
    
Explore.defaultProps = {
minterContract: null,
};

export default Explore;
