import React from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Identicon from "identicon.js";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function MyAccount(props) {
  const identicon = new Identicon(props.account.address, 80).toString();
  const [reviews, setReviews] = useState();

  const reviewContract = props.contracts[0];
  const navigate = useNavigate();

  useEffect(() => {
    getReviewsForUser();
  }, []);

  const getReviewsForUser = async () => {
    const res = await reviewContract.methods.getAllReviews().call();
    let temp = new Array();
    res.map((r) => {
      if (r.reviewedBy.toUpperCase() === props.account.address.toUpperCase()) {
        temp.push(r);
      }
    });
    setReviews(temp);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        justifyContent="center"
        padding="30px"
        divider={<Divider orientation="vertical" flexItem color="white" />}
      >
        <Card sx={{ width: "200px", padding: "30px", borderRadius: "20px" }}>
          <Typography color="primary" variant="h6">
            Your Details
          </Typography>
          <Typography color="white" variant="h6">
            Username
          </Typography>
          <Typography color="white" variant="h4">
            {props.account.name}
          </Typography>
        </Card>
        <Card sx={{ padding: "30px", borderRadius: "20px", width: "400px" }}>
          <Typography color="primary" variant="h6">
            Other Details
          </Typography>
          <Typography color="primary" variant="h6">
            Amazon Username
          </Typography>
          <Typography color="white">{props.account.amazonUsername}</Typography>
          <Typography color="primary" variant="h6">
            Flipkart Username
          </Typography>
          <Typography color="white">
            {props.account.flipkartUsername}
          </Typography>
        </Card>
        <Card sx={{ width: "200px", padding: "30px", borderRadius: "20px" }}>
          <Typography color="primary" variant="h6" marginBottom="10px">
            Identicon
          </Typography>
          <Container>
            <img
              alt="#"
              width="80"
              height="80"
              src={"data:image/png;base64," + identicon}
            />
          </Container>
        </Card>
      </Stack>
      {reviews ? 
        <Card sx={{ padding: "20px", margin: "20px", borderRadius: "10px" }}>
          <Typography variant="h5" color="primary">
            Your Reviews
          </Typography>
          <br />
          <br />
          <Stack
            direction="column"
            spacing={3}
            divider={
              <Divider orientation="horizontal" flexItem color="white" />
            }
          >
            {reviews.map(r => (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>{r.content}</Typography>
              <Button
                onClick={() => navigate("/review-detail/" + r.productId)}
              >
                View
              </Button>
            </Box>
            ))}
          </Stack>
        </Card>
         : null}
    </>
  );
}

export default MyAccount;
