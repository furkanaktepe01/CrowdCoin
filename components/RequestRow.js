import React, { Component } from "react";
import web3 from "../ethereum/web3";
import { Table, Button } from "semantic-ui-react";
import getCampaign from "../ethereum/campaign";


class RequestRow extends Component {

    onApprove = async () => {

        const campaign = getCampaign(this.props.address);

        const accounts = await web3.eth.getAccounts();

        await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]
        });

    };

    onFinalize = async () => {

        const campaign = getCampaign(this.props.address);

        const accounts = await web3.eth.getAccounts();

        await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        });

    };

    render() {

        const { Row, Cell } = Table;
        const { id, request, address, approversCount } = this.props;
        const { description, value, recipient, approvalCount, comlete } = request;
        const readyToFinalize = approvalCount > (approversCount / 2);

        return (
            <Row disabled={ comlete } positive={ readyToFinalize && !comlete }>
                <Cell>{ id }</Cell>
                <Cell>{ description }</Cell>
                <Cell>{ web3.utils.fromWei(value, "ether") }</Cell>
                <Cell>{ recipient }</Cell>
                <Cell>{ approvalCount }/{ approversCount }</Cell>
                <Cell>
                    { comlete ? null : (
                        <Button color="green" basic onClick={this.onApprove}>
                            Approve
                        </Button>
                    )}
                </Cell>
                <Cell>
                    { comlete ? null : (
                        <Button color="teal" basic onClick={this.onFinalize}>
                            Finalize
                        </Button>
                    )}
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;