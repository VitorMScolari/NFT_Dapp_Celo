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
import './Explore.css';




const Explore = () => {
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
                let price = ethers.utils.formatUnits(marketItem.price, 'wei')

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
            
            await items.map(nft => {
              nft['remove'] = true
              console.log(nft)
              return address.toLowerCase() === nft.seller.toLowerCase() ? nft['relist'] = true : nft['relist'] = false
            })
            // console.log(items)
            setNfts(items);
                      

            /*
            setLoading(true);
            const allNfts = await getNfts(minterContract);
            await allNfts.map(nft => {
              return address.toLowerCase() === nft.owner.toLowerCase() ? nft['relist'] = true : nft['relist'] = false
            })

            if (!allNfts) return;
            setNfts(allNfts);
            */
            
        } catch (error) {
          console.log({ error });
        } finally {
          setLoading(false);
        }
      }, [minterContract, marketContract, address]);

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
        <>
        {!loading ? (
            <div className="explore-section">
              {nfts.length >= 1 ? (
              <Row xs={1} sm={1} lg={1} className="w-100">
                  {nfts.map((_nft) => (
                      <Nft
                          key={_nft.tokenId}
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
            </div>
        ) : (
            <Loader />
        )}
        </>
    );
    };
    

Explore.propTypes = {
    minterContract: PropTypes.instanceOf(Object)
 };
    
Explore.defaultProps = {
minterContract: null,
};

export default Explore;