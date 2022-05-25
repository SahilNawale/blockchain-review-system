import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import Review from './abis/Review.json'
import Backdrop from '@mui/material/Backdrop';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
import Navbar from "./Components/Navbar";
import MyAccount from "./Pages/MyAccount";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from './Pages/Homepage';
import ListProduct from "./Pages/ListProduct";
import ReviewDetail from "./Pages/ReviewDetail";
import WriteReview from './Pages/WriteReview';
import Signup from "./Components/Signup";


const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#0f0',
    },
    background: {
      default: '#111111',
      paper: '#212121',
    },
  },
  typography: {
    fontFamily: 'Open Sans',
    body1: {
      fontWeight: 900,
      color: "white",
    },
    h1: {
      fontFamily: 'monospace',
    },
    h2: {
      fontFamily: 'monospace',
    },
    h3: {
      fontFamily: 'monospace',
    },
    h4: {
      fontFamily: 'monospace',
    },
    h6: {
      fontFamily: 'monospace',
    },
    h5: {
      fontFamily: 'monospace',
    },
    subtitle1: {
      fontFamily: 'monospace',
    },
    subtitle2: {
      fontFamily: 'monospace',
    },
    button: {
      fontFamily: 'monospace',
      fontWeight: 900,
      // color:"black",
    },
    overline: {
      fontFamily: 'monospace',
    },
  },
});


function App() {

  const [accountData, setAccountdata] = useState({
    address: "",
    Balance: null,
  });

  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([])
  const [hasAccount, setHasAccount] = useState(false)


  useEffect(() => {
    const loadBlockchain = async () => {
      await loadWeb3();
      const result = await window.ethereum.request({ method: "eth_requestAccounts" })
      let netId = await window.web3.eth.net.getId();
      let netData = Review.networks[netId]
      const reviewContract = new window.web3.eth.Contract(Review.abi, netData.address)
      const allUsers = await reviewContract.methods.getAllUsers().call()
      setContracts([...contracts, reviewContract])
      setAccountdata({
        address:result[0]
      })
      allUsers.map(user => {
        if (user.userAddress.toUpperCase() === result[0].toUpperCase()) {
              setAccountdata({
                address: result[0],
                name: user.name,
                amazonUsername: user.amazonUsername,
                flipkartUsername: user.flipkartUsername
              });
              setHasAccount(true)
          }
          setLoading(false);
        })
      setLoading(false);  
    }
    loadBlockchain();
  }, [])

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert("Use Metamask")
    }
  }


  if (loading) {
    return (
      <Backdrop open={true}>
        <Typography color='primary' variant='h5' fontFamily='monospace'>Kindly Login via Metamask to visit the Website</Typography>
      </Backdrop>
    )
  }
  else if (!hasAccount&&!loading) {

    return (
      <ThemeProvider theme={theme}>
        <Signup account={accountData} contracts={contracts} />
      </ThemeProvider>
    )
  }
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Navbar account={accountData} contracts={contracts} />
          <Routes>
            <Route exact path='myaccount' element={<MyAccount account={accountData} contracts={contracts} />} />
            <Route exact path='list-product' element={<ListProduct contracts={contracts} account={accountData} />} />
            <Route exact path='write-review' element={<WriteReview contracts={contracts} account={accountData} />} />
            <Route exact path='review-detail/:id' element={<ReviewDetail contracts={contracts} account={accountData} />} />
            <Route exact path='/' element={<Homepage contracts={contracts} />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
