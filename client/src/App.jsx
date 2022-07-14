import React, { useState, useEffect } from "react";
import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Setup from "./components/Setup";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import "./App.css";
import getWeb3 from "./getWeb3";
import CryptoCoders from "./contracts/CryptoCoders.json";

const App = () => {
  const[contract,setContract] = useState(null);
  const[account , setAccount] = useState(null);
  const[coders , setCoders] = useState([]); 
  const[mintText , setMintText] = useState('');

  const loadWeb3Account = async(web3) => {
    const accounts = await web3.eth.getAccounts();
    if(accounts){
      setAccount(accounts[0]);
    }
  }

  const loadWeb3Contract = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const networkData = CryptoCoders.networks[networkId];
    console.log(networkData);
    if(networkData){
      const abi = CryptoCoders.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi , address);
      setContract(contract);
      console.log(contract);
      return contract;
    }
  };

  const loadNFTs = async(contract) => {
    const totalSupply = await contract.methods.totalSupply().call()
    console.log(totalSupply);

    let nfts = [];
    for(let i = 0 ; i< totalSupply ; i++){
      let coder;
      coder =  await contract.methods.coders(i).call();
      nfts.push(coder);
    }
    setCoders(nfts);
  }

  const mint = () => {
    contract.methods.mint(mintText).send({from : account} , (error) => {
      console.log("worked")
      if(!error){
        setCoders([...coders, mintText]);
        setMintText('');
      }
    })
  }

  useEffect(() => {
    async function loadWeb3() {
      const web3 = await getWeb3();
      await loadWeb3Account(web3);
      let contract = await loadWeb3Contract(web3);
      await loadNFTs(contract);
    }
    loadWeb3();
  }, []);

  return (
    <div>
      <nav className="navbar bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Crypto Coders
          </a>
          <span>{account} </span>
        </div>
      </nav>

      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col d-flex flex-column align-items-center">
            <img
              className="mb-4"
              src="https://avatars.dicebear.com/api/pixel-art/ronak.svg"
              alt=""
              height={50}
            />
            <h1 className="display-5 fw-bold">Crypto Coders</h1>
            <div className="col-6 text-center">
              <p className="lead text-center">
                These are some of the most highly motivated coders in the world!
                We are here to learn coding and apply it to the betterment of
                humanity. We are inventors , innovators and creators
              </p>
              <div>
                <input type="text" placeholder = "e.g. Ronak" className="form-control mb-2" 
                 value = {mintText}
                 onChange = {(e) => {setMintText(e.target.value)}}
                />
                <button
                onClick = {mint}
                className="btn btn-primary ">Mint</button>
              </div>
            </div>
            <div className="col-8 d-flex justify-content-center mt-4">
            {coders.map((coder , key) => (
               <div key={key} className = "d-flex flex-column align-items-center">
                <img src={`https://avatars.dicebear.com/api/pixel-art/${coder}.svg`} alt="" width = "150"/>
                <span>{coder}</span>
               </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
