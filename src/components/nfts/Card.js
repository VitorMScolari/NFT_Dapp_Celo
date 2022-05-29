import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack } from "react-bootstrap";
import { truncateAddress } from "../../utils";
import Identicon from "../ui/Identicon";

const NftCard = ({ nft }) => {
  const { image, description, exteralUrl, owner, name, price, index } = nft;

  return (
    <Col key={index} className="p-10 w-5 h-6">
      <Card className="h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={5}>
            <Identicon address={owner} size={28} />
            <span className="font-monospace text-secondary">
              {truncateAddress(owner)}
            </span>
            <Badge bg="secondary" className="ms-auto">
              {index} ID
            </Badge>
          </Stack>
        </Card.Header>

        <div className=" ratio ratio-4x3">
          <img src={image} alt={description} />
        </div>

        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Text className="flex-grow-1">{description}</Card.Text>
          <Card.Text className="flex-grow-1">{exteralUrl}</Card.Text>
          <Card.Text className="flex-grow-1">{price}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

NftCard.propTypes = {
  // props passed into this component
  nft: PropTypes.instanceOf(Object).isRequired,
};

export default NftCard;
