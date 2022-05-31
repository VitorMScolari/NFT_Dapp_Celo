import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Nft from "../nfts/Card";
import Loader from "../ui/Loader";
import { Row } from "react-bootstrap";
import { useMarketContract } from "../../hooks/useMarketContract";
import { useMinterContract } from "../../hooks/useMinterContract";
import axios from "axios";
import {ethers} from "ethers";
import { useContractKit } from "@celo-tools/use-contractkit";
import { RingLoader } from "react-spinners";
import '../explore/Explore.css';




const Profile = () => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);

    const { address } = useContractKit();
    const marketContract = useMarketContract();
    const minterContract = useMinterContract();

    const getAssets = useCallback(async () => {
      try {
          
          setLoading(true);
          const data = await marketContract.methods.fetchMarketItems().call()
          const items = await Promise.all(data.map(async marketItem => {
              const tokenId = Number(marketItem.tokenId)
              const tokenURI = await minterContract.methods.tokenURI(tokenId).call()

              const seller = marketItem.seller
              const meta = await axios.get(tokenURI)
              let price = ethers.utils.formatUnits(marketItem.price, 'ether')

              return {
                  image: meta.data.image,
                  description: meta.data.description,
                  externalUrl: meta.data.externalUrl,
                  seller: seller,
                  name: meta.data.name,
                  price: price,
                  tokenURI: tokenURI,
                  tokenId: tokenId,
                  itemId: marketItem.itemId,
              }
          }))
          if (!items) return;

          const profileItems = await items.filter(nft => {return address.toLowerCase() === nft.seller.toLowerCase()})
          
          await profileItems.map(nft => nft['relist'] = true)
          console.log(profileItems)
          setNfts(profileItems);
            
        } catch (error) {
          console.log({ error });
        } finally {
          setLoading(false);
        }
      }, [minterContract, marketContract, address]);

      useEffect(() => {
        try {
          if (minterContract) {
            getAssets();

          }
        } catch (error) {
          console.log({ error });
        }
      }, [minterContract, getAssets]);

    return (
        <div className="explore-section">
        {!loading ? (
            <>
            {nfts.length >= 1 ? (
            <Row xs={1} sm={1} lg={1} className="w-100">
                {nfts.map((_nft) => (
                    <Nft
                        key={_nft.index}
                        nft={{
                        ..._nft,
                        }}
                    />
                ))}
            </Row>
            ) : (
                <div className="nonfts-div">
                    {<RingLoader color={"green"} size={150} />}
                    <span className="nonfts-text">No NFTs yet <br /> Create one to display</span>
                </div>
            )
            }
            </>
        ) : (
            <Loader />
        )}
        </div>
    );
    };
    

Profile.propTypes = {
    minterContract: PropTypes.instanceOf(Object)
 };
    
Profile.defaultProps = {
minterContract: null,
};

export default Profile;
