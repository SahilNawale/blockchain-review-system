import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Identicon from 'identicon.js';
import { useNavigate } from 'react-router-dom';

function Navbar(props) {

    let navigate =  useNavigate();

    // var request = new XMLHttpRequest(); 
    // request.open("GET", 'https://www.amazon.in/gp/css/order-history?ref_=nav_orders_first');
    // request.onreadystatechange = function() { 
    //   if (request.readyState === 4 && request.status === 200) {
    //     console.log(response)
    //   }
    //   };
    //   request.send(null);

    const identicon = new Identicon(props.account.address,50).toString()
  
    return (
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
                Block-Quora
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Button
                  sx={{ my: 2, color: 'black', display: 'block' }}
                  onClick={()=>navigate('/')}
                >
                    Home
                </Button>
                <Button
                  sx={{ my: 2, color: 'black', display: 'block' }}
                  onClick={()=>{navigate('list-product')}}
                >
                    List-Product
                </Button>
                <Button
                  sx={{ my: 2, color: 'black', display: 'block' }}
                  onClick={()=>{navigate('write-review')}}
                >
                    Write-Review
                </Button>
            </Box>
            <Box>
                <Typography sx={{marginRight:'20px'}} color='black'>
                {props.account.address}
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
                <IconButton sx={{ p: 0 }} onClick={()=>navigate('/myaccount')}>
                <img alt="#" width='50' height='50' src={"data:image/png;base64,"+identicon}/>
                </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    )
}

export default Navbar