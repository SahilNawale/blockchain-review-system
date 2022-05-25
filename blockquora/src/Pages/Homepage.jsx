import React from 'react'
import  Box  from '@mui/material/Box';
import  Stack from '@mui/material/Stack';
import  Typography from '@mui/material/Typography';
import Card  from '@mui/material/Card';
import ButtonBase  from '@mui/material/ButtonBase';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import  TextField  from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import IosShareIcon from '@mui/icons-material/IosShare';

const useStyles = makeStyles({
  input:{
    color:"white",
  }
})

function Homepage(props) {

  const navigate = useNavigate();

  const classes = useStyles()

  const reviewContract = props.contracts[0];
  const [allProducts,setAllProducts] = useState();
  const [searchResults,setSearchResults] = useState();

  useEffect(()=>{
    const getAllReviews = async ()=>{
      const res = await reviewContract.methods.getAllProducts().call()
      setAllProducts(res);
      setSearchResults(res);
      console.log(res)
    }
    getAllReviews();
  },[])


  const handleSearch = (e) =>{
    let newProducts = []
    allProducts.map(product=>{
      if(product.title.search(new RegExp(e.target.value, "i"))!==-1||product[2].search(new RegExp(e.target.value, "i"))!==-1){
        newProducts.push(product);
      }
    })
    setSearchResults(newProducts)
  }

  return (
    <Box>
      <div style={{display:'flex',margin:'10px',justifyContent:"space-around"}}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <SearchIcon sx={{ color: 'white', mr: 1, my: 0.5 }} />
          <TextField inputProps={{className:classes.input}}  sx={{color:'white'}} id="input-with-sx" label="Search" variant="standard" onChange={handleSearch} />
        </Box>
      </div>
        <hr style={{border:"1px solid grey"}}/>
        <Stack spacing={2} alignItems='center' marginTop='20px'>
        {searchResults?searchResults.map((p,index)=>(
          <ButtonBase key={index} sx={{width:'50%',textAlign:'left',color:"white",padding:"0px"}} onClick={()=>navigate('/review-detail/'+p[5])}>
              <Card sx={{padding:"30px",borderRadius:"10px"}}>
                <Typography color='white' variant='h5'>{p[0]}</Typography>
                <Typography color='gray'>{p[1].toUpperCase()}<IconButton sx={{color:'white'}} onClick={()=>{window.location.href=p.link}}><IosShareIcon/></IconButton></Typography>
                <Typography color='gray'>{p.platform.toUpperCase()}</Typography>
                <Typography color='white' sx={{margin:"10px 0px"}}>{p[4]}</Typography>
                <Typography color='primary'>See All Reviews({p.reviewCount})</Typography>
              </Card>
          </ButtonBase>            
        )):null}
        </Stack>
    </Box>
  )
}

export default Homepage