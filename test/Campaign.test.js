const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const compiledCampaingFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaing = require("../ethereum/build/Campaign.json");

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    
    accounts = await web3.eth.getAccounts();
    
    factory = await new web3.eth.Contract(JSON.parse(compiledCampaingFactory.interface))
        .deploy({ data: compiledCampaingFactory.bytecode })
        .send({ from: accounts[0], gas: "1000000" });

    await factory.methods.createCampaign("100").send({
        from: accounts[0],
        gas: "1000000"
    });

    const deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = deployedCampaigns[0];

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaing.interface), 
        campaignAddress
    );

});

describe("Campaigns", () => {

    it("deployes a factory and a campaign", async () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it("creator is the manager", async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);
    });

    it("contribution implies being an approver", async () => {
        
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: "200"
        });

        const isApprover = await campaign.methods.approvers(accounts[1]).call();
        
        assert(isApprover);
    });

    it("requires the minimum amount for the contribution", async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: "5"
            })
        } catch(e) {
            assert(e);
        }
    });

    it("manager can create a request", async () => {
        
        const description = "buy batteries";

        await campaign.methods
            .createRequest(description, "100", accounts[4])
            .send({
                from: accounts[0],
                gas: "1000000"
            });

        const request = await campaign.methods.requests(0).call();
        
        assert.equal(description, request.description);
    });
    
    it("processes requests", async () => {
        
        await campaign.methods.contribute().send({
                from: accounts[4],
                value: "200"
            })
        
        await campaign.methods
            .createRequest("buy batteries", "100", accounts[2])
            .send({
                from: accounts[0],
                gas: "1000000"
            });
        
        await campaign.methods.approveRequest(0).send({
            from: accounts[4],
            gas: "1000000"
        })

        let priorBalanceOfBatterySupplier =  await web3.eth.getBalance(accounts[2]); 
        priorBalanceOfBatterySupplier = web3.utils.fromWei(priorBalanceOfBatterySupplier, "ether");

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: "1000000"
        })

        let batterySupplierBalance = await web3.eth.getBalance(accounts[2]); 
        batterySupplierBalance = web3.utils.fromWei(batterySupplierBalance, "ether");

        assert(batterySupplierBalance > priorBalanceOfBatterySupplier);
    });

});
