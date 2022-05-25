import React from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import  Select  from "@mui/material/Select";
import  MenuItem  from "@mui/material/MenuItem";
import  FormControl  from "@mui/material/FormControl";
import  InputLabel  from "@mui/material/InputLabel";

const useStyles = makeStyles({
  input: {
    color: "white",
    borderColor: "lime",
  },
});

function ListProduct(props) {
  const classes = useStyles();

  const contracts = props.contracts;
  const reviewContract = contracts[0];

  const [formData, setFormData] = useState({});
  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    console.log(event.target.name);
  };

  const handleSubmit = async () => {
    await reviewContract.methods
      .addProduct(
        formData.title,
        formData.category,
        formData.platform,
        formData.link,
        formData.description
      )
      .send({ from: props.account.address });
    console.log(formData);
  };

  return (
    <Card
      sx={{
        margin: "20px auto",
        padding: "20px",
        borderRadius: "10px",
        width: "50%",
      }}
    >
      <form onChange={handleFormChange}>
        <Stack spacing={3}>
          <Typography color="white" variant="h5">
            Post A Question
          </Typography>
          <TextField
            name="title"
            inputProps={{ className: classes.input }}
            label="Title"
            variant="outlined"
            />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
            label="Category"
            name="category"
            inputProps={{className:classes.input}}
            onChange={handleFormChange}
            >
              <MenuItem value='electronics'>Electronics</MenuItem>
              <MenuItem value='grocery'>Grocery</MenuItem>
              <MenuItem value='clothing'>Clothing</MenuItem>
              <MenuItem value='sports'>Sports</MenuItem>
              <MenuItem value='mobiles and laptops'>Mobiles And Laptops</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="link"
            inputProps={{ className: classes.input }}
            label="Link"
            variant="outlined"
            />
          <FormControl fullWidth>
            <InputLabel >Platform</InputLabel>
            <Select
              label="Platform"
              name='platform'
              onChange={handleFormChange}
              inputProps={{className:classes.input}}
            >
              <MenuItem value='amazon'>Amazon</MenuItem>
              <MenuItem value='flipkart'>Flipkart</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="description"
            inputProps={{ className: classes.input }}
            label="Description"
            variant="outlined"
          />
          <Button variant="contained" onClick={handleSubmit}>
            List Product
          </Button>
        </Stack>
      </form>
    </Card>
  );
}

export default ListProduct;
