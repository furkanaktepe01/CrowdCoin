import React, { Component } from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import { Link } from "../../routes";
import getCampaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";


class CampaignShow extends Component {

    static async getInitialProps(props) {
    
        const address = props.query.address;

        const campaign = getCampaign(address);
        
        const summary = await campaign.methods.getSummary().call();
        
        return {
            address: address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
        };
    }

    renderCards() {

        const {
            minimumContribution, 
            balance, 
            requestsCount, 
            approversCount,
            manager 
        } = this.props;
        
        const items = [
            {
                header: manager,
                meta: "The Address of the Manager",
                description: "The Manager is the creator of the campaign "
                           + "and can create requests to send money from the balance to external addresses.",
                style: { overflowWrap: "break-word" }
            },
            {
                header: minimumContribution,
                meta: "The Minimum Contribution (WEI)",
                description: "Least amount of wei of contribution to become a contributer of the campaign.",
                style: { overflowWrap: "break-word" }
            },
            {
                header: requestsCount,
                meta: "The Number of Requests",
                description: "Requests are created by the manager to send money "
                           + "from the balance to external addresses, and must be "
                           + "approved by the contributers of the campaign.",
                style: { overflowWrap: "break-word" }
            },
            {
                header: approversCount,
                meta: "The Number of Approvers",
                description: "Number of contributers of the campaign.",
                style: { overflowWrap: "break-word" }
            },
            {
                header: web3.utils.fromWei(balance, "ether"),
                meta: "The Balance (ETH)",
                description: "The balance of the contract of the campaign.",
                style: { overflowWrap: "break-word" }
            }
        ]

        return <Card.Group items={items}/>;
    }

    render() {
        return (
            <Layout>
                <h2>Campaign Details:<h4>{ this.props.address }</h4></h2>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={ this.props.address }/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${ this.props.address }/requests`}>
                                <a><Button primary>View Requests</Button></a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    };
}

export default CampaignShow;