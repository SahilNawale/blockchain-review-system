import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useState } from "react";
import { makeStyles } from "@mui/styles";
import ButtonBase from "@mui/material/ButtonBase";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import { create } from "ipfs-http-client";

const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");

const useStyles = makeStyles({
  input: {
    color: "white",
  },
});

function WriteReview(props) {
  const reviewContract = props.contracts[0];

  const classes = useStyles();

  const [products, setProducts] = useState();
  const [formData, setFormData] = useState();
  const [open, setOpen] = useState();
  const [canWrite, setCanWrite] = useState(false);
  const [fileNames, setFileNames] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileHashes,setFileHashes] = useState([]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getProduct = async () => {
    const allProducts = await reviewContract.methods.getAllProducts().call();
    allProducts.map((p) => {
      if (
        p.link.search(formData.ASIN) !== -1 &&
        p.platform === formData.platform
      ) {
        setProducts(p);
      }
    });
  };

  const writeReview = () => {
    setOpen(true);
    console.log(formData);
    axios.post("http://localhost:5000", { link: formData.link }).then((res) => {
      console.log(res.data);
      if (res.data === props.account.amazonUsername) {
        setCanWrite(true);
      }
    });
  };

  const handleSubmit = () => {
    console.log(formData);
    reviewContract.methods
      .addReview(products.id, formData.description,fileHashes)
      .send({ from: props.account.address });
  };

  const handleFiles = async (e) => {
    setUploading(true);
    let names = "";
    let hashes = [];
    if(e.target.files.length>3){
      window.location.href='/write-review';
    }
    for (let i = 0; i < e.target.files.length; i++) {
      names += e.target.files[i].name.slice(0, 20) + "... ,";
      hashes.push((await ipfsClient.add(e.target.files[i])).path);
    }

    console.log(hashes);
    setFileNames(names);
    setFileHashes(hashes)
    setUploading(false);
  };

  return (
    <>
      <Paper
        sx={{ margin: "10px", padding: "20px" }}
        onChange={handleFormChange}
      >
        <Typography color="primary" sx={{ display: "inline" }}>
          Note :{" "}
        </Typography>
        <Typography sx={{ display: "inline" }}>
          You First need to write a review the product on the original platform
          you bought the product from{" "}
        </Typography>
        <hr style={{ background: "gray", border: "1px solid black" }} />
        <FormControl>
          <FormLabel sx={{ color: "white" }}>
            Select the platform you bought the product from
          </FormLabel>
          <RadioGroup name="platform">
            <FormControlLabel
              value="amazon"
              control={<Radio />}
              label="Amazon"
            />
            <FormControlLabel
              value="flipkart"
              control={<Radio />}
              label="Flipkart"
            />
          </RadioGroup>
        </FormControl>
        <div style={{ height: "10px" }} />
        <TextField
          inputProps={{ className: classes.input }}
          fullWidth
          variant="filled"
          name="link"
          label="Link to the original product"
        />
        <div style={{ height: "10px" }} />
        <TextField
          inputProps={{ className: classes.input }}
          fullWidth
          name="ASIN"
          variant="filled"
          label="ASIN"
        />
        <tr />
        <Button variant="contained" onClick={getProduct}>
          Search
        </Button>
        <tr />
      </Paper>
      {products ? (
        <Box
          sx={{
            width: "50%",
            textAlign: "left",
            color: "white",
            padding: "0px",
            margin: "20px",
          }}
        >
          <Card sx={{ padding: "30px", borderRadius: "10px" }}>
            <Typography color="white" variant="h5">
              {products[0]}
            </Typography>
            <Typography color="gray">{products[1].toUpperCase()}</Typography>
            <Typography color="white" sx={{ margin: "10px 0px" }}>
              {products[4]}
            </Typography>
            <Typography color="primary">
              Review Count : ({products.reviewCount})
            </Typography>
            <tr />
            <TextField
              variant="outlined"
              InputProps={{
                className: classes.input,
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="contained" onClick={writeReview}>
                      Go
                    </Button>
                  </InputAdornment>
                ),
              }}
              onChange={handleFormChange}
              label="Enter the link to your review"
              fullWidth
              name="link"
            />
          </Card>
        </Box>
      ) : null}
      <Dialog onClose={() => setOpen(false)} open={open}>
        <Card
          sx={{
            margin: "20px",
            padding: "20px",
            borderRadius: "10px",
            width: "500px",
            margin: "20px auto",
          }}
        >
          {canWrite ? (
            <Stack spacing={3}>
              <Typography color="white" variant="h5">
                Write a review
              </Typography>
              <TextField
                name="description"
                onChange={handleFormChange}
                inputProps={{ className: classes.input }}
                label="Description"
                variant="outlined"
              />

              <label htmlFor="contained-button-file">
                <input
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={handleFiles}
                  style={{ display: "none" }}
                />
                <Button variant="contained" component="span">
                  {uploading ? "Uploading... Pls Wait" : "Upload(Max 3)"}
                </Button>
              </label>
              <Typography color="white"> {fileNames}</Typography>
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>

            </Stack>
          ) : (
            <Typography>
              You can not write review because you have not bought this product
            </Typography>
          )}
        </Card>
      </Dialog>
    </>
  );
}

export default WriteReview;
