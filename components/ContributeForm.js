import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { Router } from "next/router";
import web3 from "../ethereum/web3";
import getCampaign from "../ethereum/campaign";

class ContributeForm extends Component {

    state = {
        value: "",
        errorMessage: "",
        loading: false
    };

    onSubmit = async (e) => {      

        e.preventDefault();

        this.setState({ loading: true, errorMessage: "" });

        const address = this.props.address;

        const campaign = getCampaign(address);

        try {
            
            const accounts = await web3.eth.getAccounts();
            
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, "ether")
            });

            Router.replaceRoute(`/campaigns/${address}`);

        } catch(err) {
            this.setState({ errorMessage: err.message });
        } 

        this.setState({ loading: false, value: "" });
    };

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input 
                        label="ether"
                        labelPosition="right"
                        value={this.state.value}
                        onChange={e => this.setState({ value: e.target.value })}
                    />
                </Form.Field>
                <Message 
                    error 
                    header="Some error has occured."
                    content={this.state.errorMessage}    
                />
                <Button primary loading={this.state.loading}>
                    Contribute
                </Button>
            </Form>
        );
    }
}

export default ContributeForm;