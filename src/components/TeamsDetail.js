import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import './../styles/TeamsDetail.css'

class TeamDetails extends React.Component {

    constructor() {
        super();
        this.state = { show: false, monthlyBreakdown: [] }
    }

    displayMonthBreakdownPopup(date) {
        if (this.props.isMonth) {
            this.fetchWeeklyBreakdown(date).then(result => {
                this.setState({ show: this.state.show, monthlyBreakdown: result });
                this.showModal();
            });
        }
    }

    async fetchWeeklyBreakdown(date) {
        let dateString = date.slice(0, 8) + "01";
        const apiUrl = 'http://stubber.test.visiblethread.com/scans/' + this.props.selectedTeam + '/' + dateString;
        const response = await fetch(apiUrl);
        return response.json();
    }

    monthlyBreakdown() {
        const listReport = this.state.monthlyBreakdown.map((row, index) =>
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{row.totalScans}</td>
                <td colSpan={2}>{this.popupDateDisplay(row.date)}</td>
            </tr>
        );
        return listReport;
    }

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    popupDateDisplay(date){
        var DateObj = new Date(date);
        var dateString = DateObj.toDateString();
        var month = dateString.split(' ')[1] + ' ' + dateString.split(' ')[2];
        return <>{month}</>
    }

    dateDisplaying = (date) => {
        var DateObj = new Date(date);
        var dateString = DateObj.toDateString();
        var month = dateString.split(' ')[1] + ' ' + dateString.split(' ')[2];
        if (this.props.isMonth) {
            month = dateString.split(' ')[1];
        }
        return <>{month}</>
    }

    weekOrMonthDisplay(row){
        if (this.props.isMonth) {
            return <td className='monthly-scans-cell' onClick={() => this.displayMonthBreakdownPopup(row.date)}>{row.scansAMonth}</td>
        }
        return <td>{row.scansAWeek}</td>
    }


    render() {
        const listReport = this.props.reportData.map((row, index) =>
            <tr key={index}>
                <td>{index + 1}</td>
                {this.weekOrMonthDisplay(row)}
                <td className='col-3'>{this.dateDisplaying(row.date)}</td>
            </tr>
        );

        return (<>
            <Modal show={this.state.show} onHide={this.hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Month Breakdown</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>iD</th>
                            <th>Scans</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.monthlyBreakdown()}
                    </tbody>
                </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.hideModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>iD</th>
                        <th>Scans</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {listReport}
                </tbody>
            </Table>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className='col-2'>Average Scans</th>
                        <th className='col-2'>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{this.props.average}</td>
                        <td>{this.props.total}</td>
                    </tr>
                </tbody>
            </Table>
        </>
        );
    }
}
export default TeamDetails;