import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Button, Modal, Form, FloatingLabel  } from "react-bootstrap";
import { truncateAddress } from "../../utils";
import Identicon from "../ui/Identicon";
import { toast } from "react-toastify";
import { NotificationSuccess,  NotificationError} from "../ui/Notifications";
import { useMinterContract } from "../../hooks";
import {useMarketContract} from "../../hooks/useMarketContract";
import { createMarketItem } from "../../utils/minter";
import { useContractKit } from "@celo-tools/use-contractkit";
import MarketplaceContractAddress from "../../contracts/Marketplace-address.json";

const NftCard = ({ nft }) => {
  // const { image, description, externalUrl, owner, name, price, tokenId } = nft;

  const [relist, setRelist] = useState(false)
  const { address } = useContractKit();

  const [show, setShow] = useState(false);

  const [price, setPrice] = useState(0);
  const marketContract = useMarketContract();
  const minterContract = useMinterContract();


  // check if all form data has been filled
  const isFormFilled = () =>
  nft && price;

  // close the popup modal
  const handleClose = () => {
    setShow(false);
  };

  const relistNft = async () => {
    try {
        const createItem = await createMarketItem(nft.seller, minterContract, marketContract, price, nft.tokenId);
        if (!createItem) return;
        setRelist(false);
        toast(<NotificationSuccess text="Updating NFT list...." />);
      } catch (error) {
        console.log({ error });
        alert("Failed to Re-List NFT." )
        toast(<NotificationError text="Failed to Re-List NFT." />);
      }
    };

  const removeNft = async () => {
    try {
        // await minterContract.methods.setApprovalForAll(MarketplaceContractAddress.address, true).send({ from: nft.seller })
        await marketContract.methods.removeItem(nft.tokenId).send({ from: nft.seller });
        setRelist(true)
      } catch (error) {
        console.log({ error });
        alert("Failed to Remove NFT." )
        toast(<NotificationError text="Failed to Remove NFT." />);
      }
    };


  const buyNft = async () => {
    try {
        console.log(nft.itemId)
        const id = parseInt(nft.itemId)
        await marketContract.methods.purchaseItem(id).send({ from: address });
      } catch (error) {
        console.log({ error });
        alert("Failed to Buy NFT." )
        toast(<NotificationError text="Failed to Buy NFT." />);
      }
    };



  const getPrice = (e) => {
    try {
      const listingPrice = parseFloat(e)
      setPrice(listingPrice);
    } catch (error) {
      console.log({ error })
      toast(<NotificationError text="Price must be a Number." />);
    }
  }

  // display the popup modal
  const handleShow = () => setShow(true);


  return (
    <Col xs={5} sm={3} lg={3} xl={2} key={nft.tokenId} className="p-1 m-2">
      <Card className="h-100">
        <Card.Header>
          <Stack direction="horizontal" className="w-5" gap={3}>
            <Identicon address={nft.owner} size={22} />
            <span className="font-monospace text-secondary">
              {truncateAddress(nft.owner)}
            </span>
            <Badge bg="secondary" className="ms-auto">
              {nft.tokenId} ID
            </Badge>
          </Stack>
        </Card.Header>

        <div className=" ratio ratio-4x3">
          <img src={nft.image} alt={nft.description} />
        </div>

        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{nft.name}</Card.Title>
          <Card.Text className="flex-grow-1">{nft.description}</Card.Text>
          <Card.Text className="flex-grow-1">{`${nft.price} USD`}</Card.Text>
          <Card.Text className="flex-grow-1">{nft.exteralUrl}</Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex  flex-row justify-content-center text-center">
          {!nft.remove && <Button variant="outline-dark" className="rounded-pill px-4 mx-2 card-btn" onClick={buyNft}>Buy</Button>}
          {nft.remove && !relist && <Button variant="outline-dark" className=" rounded-pill px-2 card-btn" onClick={removeNft}>Remove From Market</Button>}
          {relist && (
            <>
            <Button
              onClick={handleShow}
              variant="dark"
              className="rounded-pill px-4 card-btn"
            >
              Re-List your NFT
            </Button>
      
            {/* Modal */}
            <Modal show={show} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Re-List NFT</Modal.Title>
              </Modal.Header>
      
              <Modal.Body>
                  <Form>
                      <FloatingLabel
                          controlId="InputPrice"
                          label="Price"
                          className="mb-3"
                          >
                      <Form.Control
                          as="textarea"
                          placeholder="Listing Price for your NFT"
                          style={{ height: "80px" }}
                          onChange={(e) => {
                          getPrice(e.target.value);
                          }}
                      />
                      <select>
                          <option value="CELO">CELO</option>
                      </select>
                      </FloatingLabel>
                  </Form>
              </Modal.Body>
      
              <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  variant="dark"
                  disabled={!isFormFilled()}
                  onClick={() => {
                    relistNft();
                    handleClose();
                  }}
                >
                  Re-List NFT
                </Button>
              </Modal.Footer>
            </Modal>
          </>
          )}
        </Card.Footer>
      </Card>
    </Col>
  );
};

NftCard.propTypes = {
  // props passed into this component
  nft: PropTypes.instanceOf(Object).isRequired,
};

export default NftCard;
