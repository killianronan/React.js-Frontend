import React from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';

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


    render() {
        const weekOrMonthDisplay = (row) => {
            if (this.props.isMonth) {
                return <>
                    <td style={{ cursor: "pointer" }} onClick={() => this.displayMonthBreakdownPopup(row.date)}>{row.scansAMonth}</td></>
            }
            return <>
                <td>{row.scansAWeek}</td></>
        }

        const listReport = this.props.reportData.map((row, index) =>
            <tr key={index}>
                <td>{index + 1}</td>
                {weekOrMonthDisplay(row)}
                <td colSpan={2}>{this.dateDisplaying(row.date)}</td>
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
            <div>
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
            </div>
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Average Scans</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.props.average}</td>
                            <td>{this.props.total}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </>
        );
    }
}
export default TeamDetails;