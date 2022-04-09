import React, { Component } from 'react'
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import campaignFactory from "../../ethereum/campaign-factory";
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {

    state = {
        minimumContribution: "",
        errorMessage: "",
        loading: false
    }

    onSubmit = async (e) => {
        
        e.preventDefault();

        this.setState({ loading: true, errorMessage: "" });

        try{
            
            await campaignFactory.methods.createCampaign(this.state.minimumContribution)
                .send({
                    from: (await web3.eth.getAccounts())[0]
                });

            Router.pushRoute("/");
            
        } catch (err) {
            this.setState({ errorMessage: err.message })
        }
        
        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit={this.onSubmit} error={ !!this.state.errorMessage }>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                            label="wei" 
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={e => this.setState({ minimumContribution: e.target.value })}
                        />
                    </Form.Field>
                    <Message 
                        error
                        header="Some error has been occured."
                        content={ this.state.errorMessage }
                    />
                    <Button primary loading={ this.state.loading }>Create</Button>
                </Form>
            </Layout>
        );
    };
}

export default CampaignNew;
