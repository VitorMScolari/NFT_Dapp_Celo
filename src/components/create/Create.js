import React, { useState } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";
import { toast } from "react-toastify";
import { NotificationSuccess,  NotificationError} from "../ui/Notifications";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { uploadToIpfs } from "../../utils/minter";
import { useMinterContract } from "../../hooks";
import {useMarketContract} from "../../hooks/useMarketContract";
import { createNft } from "../../utils/minter";


const AddNfts = () => {
  const [description, setDescription] = useState("");
  const [exteralUrl, setExteralUrl] = useState("");
  const [ipfsImage, setIpfsImage] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);

  const [price, setPrice] = useState(0);

  const { performActions, address } = useContractKit();
  const minterContract = useMinterContract();
  const marketContract = useMarketContract();


  // check if all form data has been filled
  const isFormFilled = () =>
  name && ipfsImage && description && price;

  // close the popup modal
  const handleClose = () => {
    setShow(false);
  };

  const addNft = async (data) => {
    try {
        await createNft(minterContract, marketContract, price, performActions, data);
        toast(<NotificationSuccess text="Updating NFT list...." />);
      } catch (error) {
        console.log({ error });
        toast(<NotificationError text="Failed to create an NFT." />);
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
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-4"
      >
        Create your NFT
      </Button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create NFT</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FloatingLabel
              controlId="inputLocation"
              label="Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Name of NFT"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="InputExternalUrl"
              label="ExternalUrl"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="external url to your NFT (optional)"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setExteralUrl(e.target.value);
                }}
              />
            </FloatingLabel>

            <Form.Control
              type="file"
              className={"mb-3"}
              onChange={async (e) => {
                const imageUrl = await uploadToIpfs(e);
                if (!imageUrl) {
                  alert("failed to upload image");
                  return;
                }
                setIpfsImage(imageUrl);
              }}
              placeholder="Product name"
            ></Form.Control>
          </Form>

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
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              addNft({
                name,
                description,
                exteralUrl,
                ipfsImage,
                ownerAddress: address
              });
              handleClose();
            }}
          >
            Create NFT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNfts;
