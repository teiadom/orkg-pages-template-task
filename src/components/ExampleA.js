import React, { Component } from 'react';
import './visWidgetConfig.css';
import { Spinner, Table } from 'reactstrap';
import { getComparisonById } from 'network/networkRequests';
import { isValidHttpUrl } from '../utils/helpers';

class ExampleA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            requestedData: null
        };
    }

    componentDidMount() {
        // fetch data
        this.getData();
    }

    getData = () => {
        getComparisonById('R44930').then(dataFrame => {
            this.setState({ requestedData: dataFrame, loading: false });
        });
    };

    renderData = () => {
        // create an authors array;
        const authorStatements = this.state.requestedData.statementsData.content.filter(item => item.predicate.id === 'P27');

        if (!this.state.requestedData) {
            return <div>Some error</div>;
        } else {
            return (
                <div>
                    <div>
                        Title: <b>{this.state.requestedData.resourceMetaData.label}</b>; Number of contributions:{' '}
                        <b>{this.state.requestedData.comparisonData.contributions.length}</b>
                    </div>
                    <div>
                        Authors:{' '}
                        {authorStatements.map(item => {
                            return item.object.label + '; ';
                        })}
                    </div>
                    <div>Comparison Data:</div>
                    {this.renderComparisonTable()}
                </div>
            );
        }
    };

    renderComparisonTable = () => {
        const dataFrame = this.state.requestedData.comparisonData;
        return (
            <Table responsive bordered striped style={{ width: '100%' }}>
                {/*  define headers*/}
                <thead>
                    <tr>
                        <th>
                            <span className="table-column">Contribution</span>
                        </th>
                        {dataFrame.properties
                            .filter(property => property.active === true)
                            .map(property => {
                                return (
                                    <th key={property.label}>
                                        <span className="table-column">
                                            {property.label}
                                        </span>
                                    </th>
                                );
                            })}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(dataFrame.data).map((data, id) => {
                        return (
                            <tr key={'tr_id' + id}>
                                <td key={'td_id_' + id}>
                                    <span className="table-column">
                                        {dataFrame.contributions[id].contributionLabel +
                                            '(' +
                                            dataFrame.contributions[id].id +
                                            '/' +
                                            dataFrame.contributions[id].paperId +
                                            ')'}
                                    </span>
                                </td>
                                {this.createRows(id)}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    };

    createRows = rowId => {
        // property filtering
        const dataFrame = this.state.requestedData.comparisonData;
        const activeProperties = dataFrame.properties.filter(property => property.active === true);
        return activeProperties.map(property => {
            const dataValues = dataFrame.data[property.id][rowId];
            return (
                <td key={'td_id' + rowId + '_' + property.id}>
                    <span className="table-column">
                        {dataValues.map((val, index) => {
                            if (isValidHttpUrl(val.label)) {
                                return (
                                    <a href={val.label} key={index}>
                                        {val.label} {''}
                                    </a>
                                );
                            }
                            return val.label + ' ';
                        })}
                    </span>
                </td>
            );
        });
    };

    /** Component Rendering Function **/
    render() {
        return (
            <div>
                <div className={'headerStyle'}>
                    Example A: Comparisons{' '}
                    <a style={{ color: '#e86161' }} href="https://www.orkg.org/orkg/comparison/R44930">
                        COVID-19 Reproductive Number Estimates
                    </a>
                </div>
                <div className={'bodyStyle'}>
                    {this.state.loading && <Spinner color="dark" />}
                    {!this.state.loading && this.renderData()}
                </div>
            </div>
        );
    }
}

export default ExampleA;
