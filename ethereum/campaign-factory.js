import web3 from "./web3";
import CampaingFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(CampaingFactory.interface),
    "0xf84DE10DA70088c860b71A887a6505Cb05b53b12"
);

export default instance;


