const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledCampaingFactory = require("./build/CampaignFactory.json");


const accountMnemonic = "****";
const infuraEndPoint = "https://rinkeby.infura.io/v3/d27de234839e40b0b73d79eaca81a237";

module.exports = { infuraEndPoint };

const provider = new HDWalletProvider(accountMnemonic, infuraEndPoint);


const web3 = new Web3(provider);

const deploy = async () => {
  
  const accounts = await web3.eth.getAccounts();

  const result = await new web3.eth.Contract(JSON.parse(compiledCampaingFactory.interface))
    .deploy({ data: compiledCampaingFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });


  console.log("Deployed at: " + result.options.address); 

  provider.engine.stop();
};

deploy();

// Deployed at: 0xf84DE10DA70088c860b71A887a6505Cb05b53b12