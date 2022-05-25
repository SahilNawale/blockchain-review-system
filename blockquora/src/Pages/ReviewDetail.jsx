import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { useParams } from "react-router";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Web3 from "web3";
import IconButton from "@mui/material/IconButton";
import IosShareIcon from "@mui/icons-material/IosShare";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import { Fade } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function ReviewDetail(props) {
  const pId = useParams().id;

  const reviewContract = props.contracts[0];
  const [allProducts, setAllProducts] = useState();
  const [allReviews, setAllReviews] = useState([]);
  // const [open, setOpen] = useState(false);
  // const [description, handleDescription] = useState();
  const [hasAccess, setAccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const questions = await reviewContract.methods.getAllProducts().call();
      setAllProducts(questions);
      const reviews = await reviewContract.methods.getAllReviews().call();
      console.log(reviews);
      let temp = new Array();
      reviews.map((r) => {
        if (r.productId === pId) {
          temp.push(r);
        }
      });
      setAllReviews(temp);

      const access = await reviewContract.methods
        .hasAccess(pId)
        .call({ from: props.account.address });
      setAccess(access);
    };
    getData();
  }, []);

  // const handleSubmit = async () => {
  //     const res = await reviewContract.methods.addReview(pId, description).send({ from: props.account.address });
  //     setOpen(false);
  //     handleDescription("")
  // }

  const getAccess = async () => {
    const res = await reviewContract.methods.getAccess(pId).send({
      from: props.account.address,
      value: Web3.utils.toWei("1", "ether").toString(),
    });
    const access = await reviewContract.methods
      .hasAccess(pId)
      .call({ from: props.account.address });
    setAccess(access);
  };

  if (!hasAccess) {
    return (
      <Container
        sx={{
          width: "100%",
          alignItems: "center",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          size="large"
          sx={{ borderRadius: "20px" }}
          variant="contained"
          endIcon={<LockOpenIcon />}
          onClick={getAccess}
        >
          1 ETH
        </Button>
      </Container>
    );
  }
  return (
    <Container>
      <Stack spacing={2} alignItems="center" marginTop="20px">
        {allProducts ? (
          <Box
            sx={{
              width: "50%",
              textAlign: "left",
              color: "white",
              padding: "0px",
            }}
          >
            <Card sx={{ padding: "30px", borderRadius: "10px" }}>
              <Typography color="white" variant="h5">
                {allProducts[0][0]}
              </Typography>
              <Typography color="gray">
                {allProducts[0][1].toUpperCase()}
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => {
                    window.location.href = allProducts[0].link;
                  }}
                >
                  <IosShareIcon />
                </IconButton>
              </Typography>
              <Typography color="gray">
                {allProducts[0].platform.toUpperCase()}
              </Typography>
              <Typography color="white" sx={{ margin: "10px 0px" }}>
                {allProducts[0][4]}
              </Typography>
              <Typography color="primary">See All Reviews</Typography>
            </Card>
          </Box>
        ) : null}
        <hr style={{ width: "100%" }} />
        {allReviews
          ? allReviews.map((r) => (
              <>
                <ButtonBase
                  sx={{
                    width: "50%",
                    textAlign: "left",
                    color: "white",
                    padding: "0px",
                  }}
                  disableRipple={true}
                >
                  <Card sx={{ padding: "30px", borderRadius: "10px" }}>
                    <Typography color="white">{r.content} </Typography>
                    <br />
                    <Typography
                      color="primary"
                      fontSize="10px"
                      textAlign="right"
                    >
                      <span style={{ color: "white" }}>Review By :</span>{" "}
                      {r.reviewedBy.slice(0, 20) + "..."}{" "}
                    </Typography>
                    <Stack spacing={3}>
                      <Accordion>
                        <AccordionSummary>
                          <Button variant="contained" fullWidth>See Images</Button >
                        </AccordionSummary>
                        <AccordionDetails>
                          {r.imageHash.map((img) => (
                            <img
                              style={{ width: "100%" }}
                              src={"https://ipfs.infura.io/ipfs/" + img}
                              alt="#"
                            />
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    </Stack>
                  </Card>
                </ButtonBase>
              </>
            ))
          : null}
      </Stack>
    </Container>
  );
}

export default ReviewDetail;
