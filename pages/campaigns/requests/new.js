import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import getCampaign from "../../../ethereum/campaign";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layout";

class RequestNew extends Component {

    state = {
        description: "",
        value: "",
        recipient: "",
        errorMessage: "",
        loading: false
    }

    
    static async getInitialProps(props) {
        const { address } = props.query;
        return { address: address };
    }

    onSubmit = async (e) => {

        e.preventDefault();

        const { address } = this.props;

        this.setState({ loading: true, errorMessage: "" });

        const campaign = getCampaign(address);
        const { description, value, recipient } = this.state;

        try {
            
            const accounts = await web3.eth.getAccounts();
            
            await campaign.methods.createRequest(
                description, 
                web3.utils.toWei(value, "ether"), 
                recipient
            ).send({ from: accounts[0] });

            Router.pushRoute(`/campaigns/${address}/requests`);

        } catch(err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${ this.props.address }/requests`}>
                    Back
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={e => this.setState({ description: e.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value in ETH</label>
                        <Input
                            value={this.state.value}
                            onChange={e => this.setState({ value: e.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={this.state.recipient}
                            onChange={e => this.setState({ recipient: e.target.value })}
                        />
                    </Form.Field>
                    <Message 
                        error 
                        header="Some error has occured."
                        content={this.state.errorMessage}    
                    />
                    <Button primary loading={this.state.loading}>
                        Create
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;