import React from 'react'
import Typography  from '@mui/material/Typography';
import  Box  from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';
import Stack  from '@mui/material/Stack';
import TextField  from '@mui/material/TextField';
import Button  from '@mui/material/Button';
import Card  from '@mui/material/Card';
import InputBase  from '@mui/material/InputBase';
import {useState} from 'react'


function Signup(props) {

  const [formData,setFormData] = useState()

  const handleSubmit = ()=>{
    const reviewContract = props.contracts[0]
    reviewContract.methods.addUser(formData.name,formData.password,formData.amazonUsername,formData.flipkartUsername).send({from:props.account.address})
    // window.location.href='/';
  }
  
  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    })
 }
  const inputBaseCss = { border:"2px solid white",borderRadius:"10px",height:"7vh",padding:"5px 10px",color:"lime"}
  return (
    <Box sx={{display:"flex",justifyContent:"center",alignItems:'center',height:"100vh",flexDirection:'column'}}>
        <Box sx={{display:"flex",justifyContent:"space-around",alignItems:"center",flexDirection:"column",height:"100px",padding:"20px"}}>
          <LockIcon sx={{color:"white",background:"lime",padding:"10px",borderRadius:"20px"}}/>
            <Typography color='white'>  Kindly Signup</Typography>
        </Box>
        <Stack direction='column' spacing={3} sx={{margin:"10px 20%",width:"400px"}} onChange={handleChange}>
            <InputBase sx={inputBaseCss} variant='outlined' placeholder='Name' name='name'/>
            <InputBase sx={inputBaseCss} variant='outlined' type='password' placeholder='Password' name='password'/>
            <InputBase sx={inputBaseCss} variant='outlined' placeholder='Amazon Username' name='amazonUsername'/>
            <InputBase sx={inputBaseCss} variant='outlined' placeholder='Flipkart Username' name='flipkartUsername'/>
            <Button variant='contained' sx={{width:"100%"}} onClick={handleSubmit}>Signup</Button>
        </Stack>
    </Box>
  )
}

export default Signup