import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import "./App.css";
import Web3 from "web3";
import Data from "./data_json.json";
import { db } from "./firebase-config";
import Axios from "axios";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import CropNFT from "./abis/CropNFT.json";
import Market from "./abis/Market.json";

import FormAndPreview from "./FormAndPreview/FormAndPreview";
import AllCryptoBoys from "./AllCryptoBoys/AllCryptoBoys";
import AccountDetails from "./AccountDetails/AccountDetails";
import ContractNotDeployed from "./ContractNotDeployed/ContractNotDeployed"
import ConnectToMetamask from "./ConnectMetamask/ConnectToMetamask";
import Loading from "./Loading/Loading";
import Navbar from "./Navbar/Navbar";
import MyCryptoBoys from "./MyCryptoBoys/MyCryptoBoys";
import Queries from "./Queries/Queries";
import axios from "axios";
import AllMedicals from "./AllMedicals/AllMedicals";
import MedicalForm from "./MedicalForm/MedicalForm";


function getRandomValue() {
  const rand = Math.floor(Math.random() * 499);
  return rand;
}
function getRandomVal() {
  const rand = Math.floor((Math.random() * 10) % 7);
  return rand;
}



const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});
 
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountAddress: "",
      accountBalance: "",
      cropNFTContract: null,
      marketContract:null,
      cryptoBoysCount: 0,
      cryptoBoys: [],
      loading: true,
      metamaskConnected: false,
      contractDetected: false,
      totalTokensMinted: 0,
      totalTokensOwnedByAccount: 0,
      nameIsUsed: false,
      colorIsUsed: false,
      colorsUsed: [],
      lastMintTime: null,
      users: [],
      medicalUsers:[],
      assetName:"",
      image:"",
      lat:"",
      lon:"",
      humidity:"",
      price:"",
      light:"",
      pressure:"",
      rating:"",
      temperature:"",
      timestamp:"",
      distance:"",
      liink:"",
    };
  }

  componentWillMount = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.setMetaData();
    await this.setMintBtnTimer();
    await this.getUsers();
    await this.getMedUsers();
  };

  setMintBtnTimer = () => {
    const mintBtn = document.getElementById("mintBtn");
    if (mintBtn !== undefined && mintBtn !== null) {
      this.setState({
        lastMintTime: localStorage.getItem(this.state.accountAddress),
      });
      this.state.lastMintTime === undefined || this.state.lastMintTime === null
        ? (mintBtn.innerHTML = "Mint My Article")
        : this.checkIfCanMint(parseInt(this.state.lastMintTime));
    }
  };

  checkIfCanMint = (lastMintTime) => {
    const mintBtn = document.getElementById("mintBtn");
    const timeGap = 300000; //5min in milliseconds
    const countDownTime = lastMintTime + timeGap;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countDownTime - now;
      if (diff < 0) {
        mintBtn.removeAttribute("disabled");
        mintBtn.innerHTML = "Mint My Article";
        localStorage.removeItem(this.state.accountAddress);
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        mintBtn.setAttribute("disabled", true);
        mintBtn.innerHTML = `Next mint in ${minutes}m ${seconds}s`;
      }
    }, 1000);
  };

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      this.setState({ metamaskConnected: false });
    } else {
      this.setState({ metamaskConnected: true });
      this.setState({ loading: true });
      this.setState({ accountAddress: accounts[0] });
      let accountBalance = await web3.eth.getBalance(accounts[0]);
      accountBalance = web3.utils.fromWei(accountBalance, "Ether");
      this.setState({ accountBalance });
      this.setState({ loading: false });
      const networkId = await web3.eth.net.getId();
      if (networkId == '4690') {
        this.setState({ loading: true });
        const cropNFTContract = new web3.eth.Contract(
          CropNFT.abi,
          "0x8b8c57151707BE5bEDce3E24696695C2683a5597"
        );
        this.setState({ cropNFTContract });
        const marketContract = new web3.eth.Contract(
          Market.abi,
          "0x1E05b99ce758C4CC2389e55e4De11FDa33456e79"
        );
        
        this.setState({ marketContract });

        console.log(marketContract)
        this.setState({ contractDetected: true });
        
/*      this.setState({ cryptoBoysCount }); 
        this.setState({ totalTokensMinted });
        this.setState({ totalTokensOwnedByAccount }); */
        this.setState({ loading: false });
      } else {
        this.setState({ contractDetected: false });
      }
    }
  };

  connectToMetamask = async () => {
    await window.ethereum.enable();
    this.setState({ metamaskConnected: true });
    window.location.reload();
  };

  setMetaData = async () => {
    if (this.state.cryptoBoys.length !== 0) {
      this.state.cryptoBoys.map(async (cryptoboy) => {
        const result = await fetch(cryptoboy.tokenURI);
        const metaData = await result.json();
        this.setState({
          cryptoBoys: this.state.cryptoBoys.map((cryptoboy) =>
            cryptoboy.tokenId.toNumber() === Number(metaData.tokenId)
              ? {
                  ...cryptoboy,
                  metaData,
                }
              : cryptoboy
          ),
        });
      });
    }
  };


  getUsers = async () => {
    const usersCollectionRef = collection(db, "users");
    const data = await getDocs(usersCollectionRef);
    this.setState({
      users:data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    });
    // console.log(data);
  };

  getMedUsers = async () => {
    const MedusersCollectionRef = collection(db, "medicalUsers");
    const data = await getDocs(MedusersCollectionRef);
    this.setState({
      medicalUsers:data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    });
    // console.log(data);
  };




  mintMyNFT = async (name, tokenPrice) => {
                this.setState({ loading: true });

                let ImageList = [
                  "QmanhUetUNsJbQxA6M4Co1eydY91Vu6PZvoJifrgNJ5FzH",
                  "QmS4hHWsVyQGaSb1VrfyFCE5qCXBBVFRYkuLhNzxEPrqEm",
                  "QmP6amwSued8zTnHiQL8eiTE2QaYv8E8ZT3yNqe8wZ6uiw",
                  "QmZkBnKdiGfun8bR3P7cobnQK7JZCtKk7HaYYhr3xp8KPu",
                  "QmUi3W1VTYJtMsjDy26BJ1HasBYknQB76jcDGCP9k5C9ca",
                  "QmUgzufRg2rHWa9CMqqVxXhKqqB6ZLBj16Hvjw1uUhWMcM",
                  "QmSoLhBB9mZUbNRuozNTrTq6uQGTfmmAAjWuWwfDF2ZKZA",
                  "Qmdqv21AhdTnnzpjbBoQbP1agLtbawky82uUr2qieeLn3K",
                ];

                const tokenObject = {
                  AssetName: name,
                  Image: ImageList[getRandomVal()],
                  Lat: Data[getRandomValue()].latitude,
                  Long: Data[getRandomValue()].longitude,
                  temperature: Data[getRandomValue()].temperature,
                  pressure: Data[getRandomValue()].pressure,
                  humidity: Data[getRandomValue()].humidity,
                  light: Data[getRandomValue()].light,
                  rating: "4",
                  Price: tokenPrice,
                };

                const cid = await ipfs.add(JSON.stringify(tokenObject));
                let tokenURI = `https://ipfs.io/ipfs/${cid.path}`;
                console.log(tokenURI);

                // console.log(ImageList[getRandomValue()]);
                // const pinataApiKey = "a770d310d147135d5ec4";
                // const pinataSecretApiKey =
                //   "076b05a1c38c2910d32a8079e1007d52b8c02264990e0af61fa0e544cd760c78";
                // const jsonUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

                // const json_upload = await axios
                //   .post(jsonUrl, tokenObject, {
                //     maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
                //     headers: {
                //       "Content-Type": "application/json",
                //       pinata_api_key: pinataApiKey,
                //       pinata_secret_api_key: pinataSecretApiKey,
                //     },
                //   })
                let createCrop = await this.state.cropNFTContract.methods
                  .createItem(tokenURI)
                  .send({ from: this.state.accountAddress });

                console.log(createCrop.events.Transfer.returnValues.tokenId);
                let tid = createCrop.events.Transfer.returnValues.tokenId;
                const usersCollectionRef = collection(db, "users");
                console.log(tokenURI);

                let pressure_mean = 25;
                let TEMPERATURE_mean = 22;
                let HUMIDITY_mean = 30;
                let light_mean = 40;

                let link = tokenURI;
                // console.log(link);
                let star =
                  this.state.pressure -
                  pressure_mean +
                  (this.state.temperature - TEMPERATURE_mean) +
                  (this.state.humidity - HUMIDITY_mean) +
                  (this.state.light - light_mean);
                star %= 5;
                star = Math.abs(star);
                /* if(star > 0)
          { star += 2.5}
          else if (star <= 0)
          {star -= 2.5} */
                const getData = async () => {
                  await Axios.get(link).then((response) => {
                    console.log(response);
                    this.setState({ assetName: response.data.AssetName });
                    this.setState({ image: response.data.Image });
                    this.setState({ lat: response.data.Lat });
                    this.setState({ lon: response.data.Long });
                    this.setState({ humidity: response.data.humidity });
                    this.setState({ price: response.data.Price });
                    this.setState({ light: response.data.light });
                    this.setState({ pressure: response.data.pressure });
                    this.setState({ rating: star });
                    this.setState({ temperature: response.data.temperature });
                    this.setState({ liink: tokenURI });
                    //  console.log(this.state.assetName);
                  });

                  await addDoc(usersCollectionRef, {
                    assetName: this.state.assetName,
                    humidity: this.state.humidity,
                    image: this.state.image,
                    lat: this.state.lat,
                    lon: this.state.lon,
                    price: this.state.price,
                    light: this.state.light,
                    pressure: this.state.pressure,
                    rating: star,
                    temperature: this.state.temperature,
                    link: this.state.liink,
                    token: tid,
                  });
                };
                getData();

                // const getRating = () => {
                //   console.log(this.state.pressure)

                //   let pressure_mean = 25
                //   let TEMPERATURE_mean = 22;
                //   let HUMIDITY_mean = 30;
                //   let light_mean = 40;

                //   let rating =
                //     (this.state.pressure -
                //     pressure_mean)+
                //     (this.state.temperature - TEMPERATURE_mean) +
                //     (this.state.humidity - HUMIDITY_mean) +
                //     (this.state.light - light_mean);

                //   if(rating > 0)
                //   { rating += 2.5}
                //   else if (rating <= 0)
                //   {rating -= 2.5}

                //   console.log(rating)

                // };
                // getRating();

                // const createUser = async () => {
                //   await addDoc(usersCollectionRef, {
                //     assetName: this.state.assetName ,
                //     humidity: this.state.humidity ,
                //     image: this.state.image ,
                //     lat: this.state.lat ,
                //     lon: this.state.lon ,
                //     price: this.state.price ,

                //     });
                // };

                //createUser();

                // let tokenxD = "https://ipfs.io/ipfs/QmSKL5LLcqiJjEUrmLxhc92zZJ8tYx2YYmLLfvtgsNPywh"

                /* let createCrop = await this.state.cropNFTContract.methods.createItem(json_upload).send({from : this.state.accountAddress})

      console.log(createCrop.events.Transfer.returnValues.tokenId); */

                const approvedAddress = await this.state.cropNFTContract.methods
                  .getApproved(createCrop.events.Transfer.returnValues.tokenId)
                  .call();

                if (
                  approvedAddress !=
                  "0x1E05b99ce758C4CC2389e55e4De11FDa33456e79"
                ) {
                  await this.state.cropNFTContract.methods
                    .approve(
                      "0x1E05b99ce758C4CC2389e55e4De11FDa33456e79",
                      createCrop.events.Transfer.returnValues.tokenId
                    )
                    .send({ from: this.state.accountAddress });
                }
                let market = await this.state.marketContract.methods
                  .addItemToMarket(
                    createCrop.events.Transfer.returnValues.tokenId,
                    "0x8b8c57151707BE5bEDce3E24696695C2683a5597",
                    tokenPrice
                  )
                  .send({ from: this.state.accountAddress });

                console.log(market);

                this.setState({ loading: false });

                /*  const tokenObject = {
        tokenName: "Crypto Boy",
        tokenSymbol: "CB",
        tokenId: `${tokenId}`,
        name: name,
      };

      const cid = await ipfs.add(JSON.stringify(tokenObject));
      let tokenURI = `https://ipfs.infura.io/ipfs/${cid.path}`;
      const price = window.web3.utils.toWei(tokenPrice.toString(), "Ether");
      
      this.state.cryptoBoysContract.methods
        .mintCryptoBoy(name, tokenURI, price)
        .send({ from: this.state.accountAddress })
        .on("confirmation", () => {
          localStorage.setItem(this.state.accountAddress, new Date().getTime());
          this.setState({ loading: false });
          window.location.reload();
        }); */
              };;
  mintMedNFT = async (name, tokenPrice) => {
    this.setState({ loading: true });
    
    
      let ImageList = [
        "QmcxkthdfynvjuBNEEafXJU6rCzz978rpfygPkjNufCiPe",
        "QmPHzW1EsANzwyr5EeyRVPfYTd1jReLRbkQP8Bm5XKu7RP",
        "QmaKStQsPEGHujwwEyWxqVKf9nPDLepn7S9RZBLtm8S4Xh",
        "QmdAnNN5L2fH1KYycLpVt5tdzKSNYyMQGwSaeULRXer36j",
        "Qmd5uQPNJ9kL1rNm1VCiXyhS14iLEvWjT3Uvpm2HetqNDp",
        "QmPzfVuA4GsuDCAkGRYmZUFGxXdrtEWRFyANddgfJJQvGX",
        "QmahVdUvX71a7UfGv2FYrbsqWHVGjknyeZBVofEHPQnq6y",
        "QmeRfX6HdBREJX6fLyMNfh4jeHZf7wzX7E7atEYjbhHdei",
      ];

      
      const tokenObject2 = {
        AssetName: name,
        Image: ImageList[getRandomVal()],
        Lat:Data[getRandomValue()].latitude,
        Long:Data[getRandomValue()].longitude,
        temperature:Data[getRandomValue()].temperature2,
        pressure:Data[getRandomValue()].pressure,
        humidity:Data[getRandomValue()].humidity,
        light:Data[getRandomValue()].light,
        timestamp:Data[getRandomValue()].timestamp,
        distance:Data[getRandomValue()].random,
        rating:"8",
        Price:tokenPrice

      };
   
    const cid = await ipfs.add(JSON.stringify(tokenObject2));
    let tokenURI_2 = `https://ipfs.io/ipfs/${cid.path}`;



      /* console.log(ImageList[getRandomValue()]);
      const pinataApiKey = "a770d310d147135d5ec4";
      const pinataSecretApiKey =
        "076b05a1c38c2910d32a8079e1007d52b8c02264990e0af61fa0e544cd760c78";
      const jsonUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

      const json_upload = await axios
        .post(jsonUrl, tokenObject, {
          maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        })  */
        let createCrop = await this.state.cropNFTContract.methods
          .createItem(tokenURI_2)
          .send({ from: this.state.accountAddress });

        console.log(createCrop.events.Transfer.returnValues.tokenId);
        let tid = createCrop.events.Transfer.returnValues.tokenId;
 
        const MedusersCollectionRef = collection(db, "medicalUsers");
        console.log(tokenURI_2);

      let pressure_mean = 25
      let TEMPERATURE_mean = 22;
      let HUMIDITY_mean = 30;
      let light_mean = 40;
        
       // console.log(link);
        const getData = async () => {
          let star = (this.state.pressure - pressure_mean) + (this.state.temperature - TEMPERATURE_mean) +
          (this.state.humidity - HUMIDITY_mean) +
          (this.state.light - light_mean);
          star %= 5; 
          star = Math.abs(star)
          /* if(star > 0)
          { star += 2.5}
          else if (star <= 0)
          {star -= 2.5} */
         await Axios.get(tokenURI_2).then((response) => {
           console.log(response);
           this.setState({ assetName: response.data.AssetName });
           this.setState({ image: response.data.Image });
           this.setState({ lat: response.data.Lat });
           this.setState({ lon: response.data.Long });
           this.setState({ humidity: response.data.humidity });
           this.setState({ price: response.data.Price });
           this.setState({ light: response.data.light });
           this.setState({ pressure: response.data.pressure });
           this.setState({ rating: star });
           this.setState({ temperature: response.data.temperature });
           this.setState({ timestamp: response.data.timestamp });
           this.setState({ distance: response.data.distance });
           this.setState({ liink: tokenURI_2 });
           //  console.log(this.state.assetName);
         });



          await addDoc(MedusersCollectionRef, { 
            assetName: this.state.assetName ,
            humidity: this.state.humidity ,
            image: this.state.image ,
            lat: this.state.lat ,
            lon: this.state.lon ,
            price: this.state.price ,
            light: this.state.light ,
            pressure: this.state.pressure ,
            rating: star ,
            temperature: this.state.temperature ,
            timestamp: this.state.timestamp,
            distance: this.state.distance,
            link: this.state.liink,
            token: tid ,
            });
        }
    getData();
        // const createUser = async () => {
        //   await addDoc(usersCollectionRef, { 
        //     assetName: this.state.assetName ,
        //     humidity: this.state.humidity ,
        //     image: this.state.image ,
        //     lat: this.state.lat ,
        //     lon: this.state.lon ,
        //     price: this.state.price ,
            
        //     });
        // };
        
        //createUser();

      // let tokenxD = "https://ipfs.io/ipfs/QmSKL5LLcqiJjEUrmLxhc92zZJ8tYx2YYmLLfvtgsNPywh"
      
      /* let createCrop = await this.state.cropNFTContract.methods.createItem(json_upload).send({from : this.state.accountAddress})

      console.log(createCrop.events.Transfer.returnValues.tokenId); */
    

      
      const approvedAddress = await this.state.cropNFTContract.methods
        .getApproved(createCrop.events.Transfer.returnValues.tokenId)
        .call();

      if (approvedAddress != "0x1E05b99ce758C4CC2389e55e4De11FDa33456e79") {
        await this.state.cropNFTContract.methods
          .approve(
            "0x1E05b99ce758C4CC2389e55e4De11FDa33456e79",
            createCrop.events.Transfer.returnValues.tokenId
          )
          .send({ from: this.state.accountAddress });
      }
      let market = await this.state.marketContract.methods
        .addItemToMarket(
          createCrop.events.Transfer.returnValues.tokenId,
          "0x8b8c57151707BE5bEDce3E24696695C2683a5597",
          tokenPrice
        )
        .send({ from: this.state.accountAddress });


        console.log(market)

        this.setState({ loading: false });
      

      
     /*  const tokenObject = {
        tokenName: "Crypto Boy",
        tokenSymbol: "CB",
        tokenId: `${tokenId}`,
        name: name,
      };

      const cid = await ipfs.add(JSON.stringify(tokenObject));
      let tokenURI = `https://ipfs.infura.io/ipfs/${cid.path}`;
      const price = window.web3.utils.toWei(tokenPrice.toString(), "Ether");
      
      this.state.cryptoBoysContract.methods
        .mintCryptoBoy(name, tokenURI, price)
        .send({ from: this.state.accountAddress })
        .on("confirmation", () => {
          localStorage.setItem(this.state.accountAddress, new Date().getTime());
          this.setState({ loading: false });
          window.location.reload();
        }); */
    
  };



  toggleForSale = (tokenId) => {
    this.setState({ loading: true });
    this.state.cryptoBoysContract.methods
      .toggleForSale(tokenId)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  changeTokenPrice = (tokenId, newPrice) => {
    this.setState({ loading: true });
    const newTokenPrice = window.web3.utils.toWei(newPrice, "Ether");
    this.state.cryptoBoysContract.methods
      .changeTokenPrice(tokenId, newTokenPrice)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  buyCrop = (tkId , price) => {
    let gas_price
    //this.setState({ loading: true });
    window.web3.eth.getGasPrice().then((result) => {
      gas_price = window.web3.utils.fromWei(result, "ether");
      console.log("gas price is: ", gas_price);
    });

    //console.log(typeof(window.web3.utils.toWei(price, "Ether")));
    console.log( Number(tkId), Number(price));
    this.state.marketContract.methods
      .buyItem(Number(tkId))
      .send({
        from: this.state.accountAddress,
        value: window.web3.utils.toWei(price, "Ether"),
        gas: 85000,
        gasPrice: 1000000000000,
      })
      .on("receipt", (r) => {
        console.log(r);
        this.setState({ loading: false });
      }); 
      console.log(this.state.marketContract)
      
  };

 
  render() {

    // const getData = () => {
    //   Axios.get(this.state.users).then((response)=>{
    //     console.log(response);
    //     this.setState({info : response.data.Long});
    //   })
    // }
    // getData();
    return (
      <div className="container">
        {!this.state.metamaskConnected ? (
          <ConnectToMetamask connectToMetamask={this.connectToMetamask} />
        ) : !this.state.contractDetected ? (
          <ContractNotDeployed />
        ) : this.state.loading ? (
          <Loading />
        ) : (
          <>
            <HashRouter basename="/">
              <Navbar />
              <Route
                path="/"
                exact
                render={() => (
                  <AccountDetails
                    accountAddress={this.state.accountAddress}
                    accountBalance={this.state.accountBalance}
                  />
                )}
              />
              <Route
                path="/mint"
                render={() => (
                  <FormAndPreview
                    mintMyNFT={this.mintMyNFT}
                    nameIsUsed={this.state.nameIsUsed}
                    colorIsUsed={this.state.colorIsUsed}
                    colorsUsed={this.state.colorsUsed}
                    setMintBtnTimer={this.setMintBtnTimer}
                    users={this.state.users}
                 
                  />
                )}
              />
              <Route
                path="/mint_medical"
                render={() => (
                  <MedicalForm
                    mintMedNFT={this.mintMedNFT}
                    nameIsUsed={this.state.nameIsUsed}
                    colorIsUsed={this.state.colorIsUsed}
                    colorsUsed={this.state.colorsUsed}
                    setMintBtnTimer={this.setMintBtnTimer}
                    medicalUsers={this.state.medicalUsers}
                  />
                )}
              />
              <Route
                path="/marketplace"
                render={() => (
                  <AllCryptoBoys
                    accountAddress={this.state.accountAddress}
                    cryptoBoys={this.state.cryptoBoys}
                    totalTokensMinted={this.state.totalTokensMinted}
                    changeTokenPrice={this.changeTokenPrice}
                    toggleForSale={this.toggleForSale}
                    buyCrop={this.buyCrop}
                    users={this.state.users}
                   
                  />
                )}
              />
              <Route
                path="/medical"
                render={() => (
                  <AllMedicals
                    accountAddress={this.state.accountAddress}
                    cryptoBoys={this.state.cryptoBoys}
                    totalTokensMinted={this.state.totalTokensMinted}
                    changeTokenPrice={this.changeTokenPrice}
                    toggleForSale={this.toggleForSale}
                    buyCrop={this.buyCrop}
                    medicalUsers={this.state.medicalUsers}
                  />
                )}
              />
              <Route
                path="/my-tokens"
                render={() => (
                  <MyCryptoBoys
                    accountAddress={this.state.accountAddress}
                    cryptoBoys={this.state.cryptoBoys}
                    totalTokensOwnedByAccount={
                      this.state.totalTokensOwnedByAccount
                    }
                  />
                )}
              />
              <Route
                path="/queries"
                render={() => (
                  <Queries cryptoBoysContract={this.state.cryptoBoysContract} />
                )}
              />
            </HashRouter>
          </>
        )}
      </div>
    );
  }
}

export default App;
// import React, { Component } from "react";
// import { HashRouter, Route } from "react-router-dom";
// import "./App.css";
// import Web3 from "web3";
// import Data from "./data_json.json";
// import { db } from "./firebase-config";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";

// import CropNFT from "./abis/CropNFT.json";
// import Market from "./abis/Market.json";

// import FormAndPreview from "./FormAndPreview/FormAndPreview";
// import AllCryptoBoys from "./AllCryptoBoys/AllCryptoBoys";
// import AccountDetails from "./AccountDetails/AccountDetails";
// import ContractNotDeployed from "./ContractNotDeployed/ContractNotDeployed"
// import ConnectToMetamask from "./ConnectMetamask/ConnectToMetamask";
// import Loading from "./Loading/Loading";
// import Navbar from "./Navbar/Navbar";
// import MyCryptoBoys from "./MyCryptoBoys/MyCryptoBoys";
// import Queries from "./Queries/Queries";
// import axios from "axios";


// function getRandomValue() {
//   const rand = Math.floor((Math.random() * 10) % 7);
//   return rand;
// }

// /* const ipfsClient = require("ipfs-http-client");
// const ipfs = ipfsClient({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "https",
// });
//  */
// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       accountAddress: "",
//       accountBalance: "",
//       cropNFTContract: null,
//       marketContract:null,
//       cryptoBoysCount: 0,
//       cryptoBoys: [],
//       loading: true,
//       metamaskConnected: false,
//       contractDetected: false,
//       totalTokensMinted: 0,
//       totalTokensOwnedByAccount: 0,
//       nameIsUsed: false,
//       colorIsUsed: false,
//       colorsUsed: [],
//       lastMintTime: null,
//       users: [],
//     };
//   }

//   componentWillMount = async () => {
//     await this.loadWeb3();
//     await this.loadBlockchainData();
//     await this.setMetaData();
//     await this.setMintBtnTimer();
//   };

//   setMintBtnTimer = () => {
//     const mintBtn = document.getElementById("mintBtn");
//     if (mintBtn !== undefined && mintBtn !== null) {
//       this.setState({
//         lastMintTime: localStorage.getItem(this.state.accountAddress),
//       });
//       this.state.lastMintTime === undefined || this.state.lastMintTime === null
//         ? (mintBtn.innerHTML = "Mint My Article")
//         : this.checkIfCanMint(parseInt(this.state.lastMintTime));
//     }
//   };

//   checkIfCanMint = (lastMintTime) => {
//     const mintBtn = document.getElementById("mintBtn");
//     const timeGap = 300000; //5min in milliseconds
//     const countDownTime = lastMintTime + timeGap;
//     const interval = setInterval(() => {
//       const now = new Date().getTime();
//       const diff = countDownTime - now;
//       if (diff < 0) {
//         mintBtn.removeAttribute("disabled");
//         mintBtn.innerHTML = "Mint My Article";
//         localStorage.removeItem(this.state.accountAddress);
//         clearInterval(interval);
//       } else {
//         const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((diff % (1000 * 60)) / 1000);
//         mintBtn.setAttribute("disabled", true);
//         mintBtn.innerHTML = `Next mint in ${minutes}m ${seconds}s`;
//       }
//     }, 1000);
//   };

//   loadWeb3 = async () => {
//     if (window.ethereum) {
//       window.web3 = new Web3(window.ethereum);
//     } else if (window.web3) {
//       window.web3 = new Web3(window.web3.currentProvider);
//     } else {
//       window.alert(
//         "Non-Ethereum browser detected. You should consider trying MetaMask!"
//       );
//     }
//   };

//   loadBlockchainData = async () => {
//     const web3 = window.web3;
//     const accounts = await web3.eth.getAccounts();
//     if (accounts.length === 0) {
//       this.setState({ metamaskConnected: false });
//     } else {
//       this.setState({ metamaskConnected: true });
//       this.setState({ loading: true });
//       this.setState({ accountAddress: accounts[0] });
//       let accountBalance = await web3.eth.getBalance(accounts[0]);
//       accountBalance = web3.utils.fromWei(accountBalance, "Ether");
//       this.setState({ accountBalance });
//       this.setState({ loading: false });
//       const networkId = await web3.eth.net.getId();
//       if (networkId == '4690') {
//         this.setState({ loading: true });
//         const cropNFTContract = new web3.eth.Contract(
//           CropNFT.abi,
//           "0x599427a250Bb39a96c4cddDAAbe0b5ac331CB364"
//         );
//         this.setState({ cropNFTContract });
//         const marketContract = new web3.eth.Contract(
//           Market.abi,
//           "0x3160a2cf5A2649fe372262D775848d1bB75FC56F"
//         );
        
//         this.setState({ marketContract });

//         console.log(marketContract)
//         this.setState({ contractDetected: true });
        
// /*         this.setState({ cryptoBoysCount }); 
//         this.setState({ totalTokensMinted });
//         this.setState({ totalTokensOwnedByAccount }); */
//         this.setState({ loading: false });
//       } else {
//         this.setState({ contractDetected: false });
//       }
//     }
//   };

//   connectToMetamask = async () => {
//     await window.ethereum.enable();
//     this.setState({ metamaskConnected: true });
//     window.location.reload();
//   };

//   setMetaData = async () => {
//     if (this.state.cryptoBoys.length !== 0) {
//       this.state.cryptoBoys.map(async (cryptoboy) => {
//         const result = await fetch(cryptoboy.tokenURI);
//         const metaData = await result.json();
//         this.setState({
//           cryptoBoys: this.state.cryptoBoys.map((cryptoboy) =>
//             cryptoboy.tokenId.toNumber() === Number(metaData.tokenId)
//               ? {
//                   ...cryptoboy,
//                   metaData,
//                 }
//               : cryptoboy
//           ),
//         });
//       });
//     }
//   };

//   mintMyNFT = async (name, tokenPrice) => {
//     this.setState({ loading: true });
    
    
//       let ImageList = [
//         "QmanhUetUNsJbQxA6M4Co1eydY91Vu6PZvoJifrgNJ5FzH",
//         "QmS4hHWsVyQGaSb1VrfyFCE5qCXBBVFRYkuLhNzxEPrqEm",
//         "QmP6amwSued8zTnHiQL8eiTE2QaYv8E8ZT3yNqe8wZ6uiw",
//         "QmZkBnKdiGfun8bR3P7cobnQK7JZCtKk7HaYYhr3xp8KPu",
//         "QmUi3W1VTYJtMsjDy26BJ1HasBYknQB76jcDGCP9k5C9ca",
//         "QmUgzufRg2rHWa9CMqqVxXhKqqB6ZLBj16Hvjw1uUhWMcM",
//         "QmSoLhBB9mZUbNRuozNTrTq6uQGTfmmAAjWuWwfDF2ZKZA",
//         "Qmdqv21AhdTnnzpjbBoQbP1agLtbawky82uUr2qieeLn3K",
//       ];

      
//       const tokenObject = {
//         AssetName: name,
//         Image: ImageList[getRandomValue()],
//         Lat:Data[getRandomValue()].latitude,
//         Long:Data[getRandomValue()].longitude,
//         temperature:Data[getRandomValue()].temperature,
//         pressure:Data[getRandomValue()].pressure,
//         humidity:Data[getRandomValue()].humidity,
//         light:Data[getRandomValue()].light,
//         rating:"4",
//         Price:tokenPrice

//       };
   
//     const usersCollectionRef = collection(db, "users");
  

//     const getUsers = async () => {
//       const data = await getDocs(usersCollectionRef);
//       console.log(data);
//     };

//     getUsers();

//       console.log(ImageList[getRandomValue()]);
//       const pinataApiKey = "a770d310d147135d5ec4";
//       const pinataSecretApiKey =
//         "076b05a1c38c2910d32a8079e1007d52b8c02264990e0af61fa0e544cd760c78";
//       const jsonUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

//       const json_upload = await axios
//         .post(jsonUrl, tokenObject, {
//           maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
//           headers: {
//             "Content-Type": "application/json",
//             pinata_api_key: pinataApiKey,
//             pinata_secret_api_key: pinataSecretApiKey,
//           },
//         })
//         console.log(json_upload)
//         let link = 'https://ipfs.io/ipfs/'+json_upload.data.IpfsHash;
//         console.log(link);
//         const createUser = async () => {
//           await addDoc(usersCollectionRef, { api: "dyehduhdhwu"});
//         };


//       // let tokenxD = "https://ipfs.io/ipfs/QmSKL5LLcqiJjEUrmLxhc92zZJ8tYx2YYmLLfvtgsNPywh"
      
//       let createCrop = await this.state.cropNFTContract.methods.createItem(json_upload).send({from : this.state.accountAddress})

//       console.log(createCrop.events.Transfer.returnValues.tokenId);

      
//       const approvedAddress = await this.state.cropNFTContract.methods
//         .getApproved(createCrop.events.Transfer.returnValues.tokenId)
//         .call();

//       if (approvedAddress != "0x3160a2cf5A2649fe372262D775848d1bB75FC56F") {
//         await this.state.cropNFTContract.methods
//           .approve(
//             "0x3160a2cf5a2649fe372262d775848d1bb75fc56f",
//             createCrop.events.Transfer.returnValues.tokenId
//           )
//           .send({ from: this.state.accountAddress });
//       }
//       let market = await this.state.marketContract.methods
//         .addItemToMarket(
//           createCrop.events.Transfer.returnValues.tokenId,
//           "0x599427a250Bb39a96c4cddDAAbe0b5ac331CB364",
//           tokenPrice
//         )
//         .send({ from: this.state.accountAddress });


//         console.log(market)


      

      
//      /*  const tokenObject = {
//         tokenName: "Crypto Boy",
//         tokenSymbol: "CB",
//         tokenId: `${tokenId}`,
//         name: name,
//       };

//       const cid = await ipfs.add(JSON.stringify(tokenObject));
//       let tokenURI = `https://ipfs.infura.io/ipfs/${cid.path}`;
//       const price = window.web3.utils.toWei(tokenPrice.toString(), "Ether");
      
//       this.state.cryptoBoysContract.methods
//         .mintCryptoBoy(name, tokenURI, price)
//         .send({ from: this.state.accountAddress })
//         .on("confirmation", () => {
//           localStorage.setItem(this.state.accountAddress, new Date().getTime());
//           this.setState({ loading: false });
//           window.location.reload();
//         }); */
    
//   };

//   toggleForSale = (tokenId) => {
//     this.setState({ loading: true });
//     this.state.cryptoBoysContract.methods
//       .toggleForSale(tokenId)
//       .send({ from: this.state.accountAddress })
//       .on("confirmation", () => {
//         this.setState({ loading: false });
//         window.location.reload();
//       });
//   };

//   changeTokenPrice = (tokenId, newPrice) => {
//     this.setState({ loading: true });
//     const newTokenPrice = window.web3.utils.toWei(newPrice, "Ether");
//     this.state.cryptoBoysContract.methods
//       .changeTokenPrice(tokenId, newTokenPrice)
//       .send({ from: this.state.accountAddress })
//       .on("confirmation", () => {
//         this.setState({ loading: false });
//         window.location.reload();
//       });
//   };

//   buyCryptoBoy = (tokenId, price) => {
//     this.setState({ loading: true });
//     this.state.cryptoBoysContract.methods
//       .buyToken(tokenId)
//       .send({ from: this.state.accountAddress, value: price })
//       .on("confirmation", () => {
//         this.setState({ loading: false });
//         window.location.reload();
//       });
//   };

//   render() {
//     return (
//       <div className="container">
//       {/* {!this.state.metamaskConnected ? (
//           <ConnectToMetamask connectToMetamask={this.connectToMetamask} />
//         ) : !this.state.contractDetected ? (
//           <ContractNotDeployed />
//         ) : this.state.loading ? (
//           <Loading />
//         ) : ( */}
//           <>
//             <HashRouter basename="/">
//               <Navbar />
//               <Route
//                 path="/"
//                 exact
//                 render={() => (
//                   <AccountDetails
//                     accountAddress={this.state.accountAddress}
//                     accountBalance={this.state.accountBalance}
//                   />
//                 )}
//               />
//               <Route
//                 path="/mint"
//                 render={() => (
//                   <FormAndPreview
//                     mintMyNFT={this.mintMyNFT}
//                     nameIsUsed={this.state.nameIsUsed}
//                     colorIsUsed={this.state.colorIsUsed}
//                     colorsUsed={this.state.colorsUsed}
//                     setMintBtnTimer={this.setMintBtnTimer}
//                   />
//                 )}
//               />
//               <Route
//                 path="/marketplace"
//                 render={() => (
//                   <AllCryptoBoys
//                     accountAddress={this.state.accountAddress}
//                     cryptoBoys={this.state.cryptoBoys}
//                     totalTokensMinted={this.state.totalTokensMinted}
//                     changeTokenPrice={this.changeTokenPrice}
//                     toggleForSale={this.toggleForSale}
//                     buyCryptoBoy={this.buyCryptoBoy}
//                   />
//                 )}
//               />
//               <Route
//                 path="/my-tokens"
//                 render={() => (
//                   <MyCryptoBoys
//                     accountAddress={this.state.accountAddress}
//                     cryptoBoys={this.state.cryptoBoys}
//                     totalTokensOwnedByAccount={
//                       this.state.totalTokensOwnedByAccount
//                     }
//                   />
//                 )}
//               />
//               <Route
//                  path="/queries"
//                 render={() => (
//                   <Queries cryptoBoysContract={this.state.cryptoBoysContract} />
//                 )}
//               />
//             </HashRouter>
//           </>
//           {/* )} */}
//       </div>
//     );
//   }
// }

// export default App;
