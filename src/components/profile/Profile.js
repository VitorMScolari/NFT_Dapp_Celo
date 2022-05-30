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
import '../explore/Explore.css';
import {
    getNfts
} from "../../utils/minter";




const Profile = () => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);

    const { address } = useContractKit();
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
            await allNfts.map(nft => {
              return address.toLowerCase() === nft.owner.toLowerCase() ? nft['remove'] = true : nft['remove'] = false
            })

            const myNfts = await allNfts.filter(nft => address.toLowerCase() === nft.owner.toLowerCase())

            if (!allNfts) return;
            setNfts(myNfts);
            
        } catch (error) {
          console.log({ error });
        } finally {
          setLoading(false);
        }
      }, [minterContract, address]);

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
        <div className="Profile-div">
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
                <div>
                    <h1>You don´t have any NFT´s yet, click the Create your NFT button to create one.</h1>
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
