import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Loading from './Loading';
import './../styles/Teams.css';
import TeamsDetail from './TeamsDetail';

let showError = false;
let monthsShowing = true;
let reportGen = false;
let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
let weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]

const listWeek = weeks.map((week) => <option key={week}>{week}</option>);
const listMonth = months.map((month) => <option key={month}>{month}</option>);
let selectedTeam = "";

class Teams extends React.Component {
  componentDidMount() {
    this.fetchReport(true, 1).then(result => {
      reportGen = true;
      let sum = 0;
      let isMonth = false;
      const listReport = result.filter((element) => {
        if (element["date"] && element["teamName"] === selectedTeam) {
          if (this.selectInput.current.value === "Months") {
            if (!isNaN(element["scansAMonth"])) {
              sum += element["scansAMonth"];
              isMonth = true;
            }
            else return null
          }
          else sum += element["scansAWeek"];

          return element
        }
        return null;
      });
      this.setState({ show: this.state.show, reportData: listReport, average: sum / listReport.length, total: sum, isMonth: isMonth });
    });
  }

  async fetchReport(isMonths, amount) {
    let urlPostfix = ""
    if (isMonths)
      urlPostfix = "monthly/" + amount;
    else
      urlPostfix = "weekly/" + amount;

    const apiUrl = 'http://stubber.test.visiblethread.com/scans/' + urlPostfix;
    const response = await fetch(apiUrl);
    return response.json();
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
    showError = false;
  };

  constructor() {
    super();
    this.state = { show: false }
    this.textInput = React.createRef();
    this.selectInput = React.createRef();
    this.amountInput = React.createRef();
  }

  generateReport = () => {
    if (this.amountInput.current.value) {
      this.fetchReport(monthsShowing, this.amountInput.current.value).then(result => {
        let sum = 0;
        let isMonth = false;
        const listReport = result.filter((element) => {
          if (element["date"] && element["teamName"] === selectedTeam) {
            if (this.selectInput.current.value === "Months") {
              if (!isNaN(element["scansAMonth"])) {
                sum += element["scansAMonth"];
                isMonth = true;
              }
              else return null
            }
            else sum += element["scansAWeek"];

            return element;
          }
          return null;
        });
        reportGen = true;
        this.setState({ show: this.state.show, reportData: listReport, average: sum / listReport.length, total: sum, isMonth: isMonth });
      });
    }
  };

  setSelectedTeam(team) {
    selectedTeam = team;
    reportGen = false;
    this.setState({ show: this.state.show });
    this.generateReport();
  }

  getModalFormChanges = () => {
    const isDuplicate = (element) => element === this.textInput.current.value;
    if (this.props.teams.findIndex(isDuplicate) > -1) {
      showError = true;
      this.setState({ show: this.state.show });
    }
    else {
      showError = false;
      this.setState({ show: this.state.show });
    }
  };

  setSelectedDisplayFormat = () => {
    if (this.selectInput.current.value === "Weeks") {
      monthsShowing = false;
      this.setState({ show: this.state.show });
    }
    else {
      monthsShowing = true;
      this.setState({ show: this.state.show });
    }
  }

  submitModal = () => {
    if (this.textInput.current.value.length > 0 && !showError) {
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
          body: JSON.stringify(this.textInput.current.value)
        };

        fetch("http://stubber.test.visiblethread.com/teams/add", requestOptions)
          .then((res) => res.json())
          .then((result) => {
            this.setState({ show: false });
            alert("Successfully posted new user!")
          });
      } catch (e) {
        console.log("Error posting user: ", e.message);
      }
    }
  };
  ErrorDisplaying(){
    if (!showError) {
      return <Form.Text id="teamHelpBlock" muted>
        No duplicate team names allowed.
      </Form.Text>;
    }
    return <Form.Text id="teamHelpBlock" style={{ color: "red" }}>
      Duplicate team name entered.
    </Form.Text>;
  }

  weeksMonthsNumber(){
    if (!monthsShowing) {
      return <><Form.Label htmlFor="timePeriod">Weeks</Form.Label>
        <Form.Select size="sm" style={{ width: "100px" }} ref={this.amountInput}>
          {listWeek}
        </Form.Select></>;
    }
    return <><Form.Label htmlFor="timePeriod">Months</Form.Label>
      <Form.Select size="sm" style={{ width: "100px" }} ref={this.amountInput}>
        {listMonth}
      </Form.Select></>;
  }

  reportGenerated(){
    if (!reportGen) {
      return <div id="report" className="col-md-10 loading-container">
        <Loading />
      </div>;
    }
    return <div id="report" className="col-md-10 report-container">
      <TeamsDetail selectedTeam={selectedTeam} reportData={this.state.reportData} average={this.state.average} total={this.state.total} isMonth={this.state.isMonth} />
    </div>;  
  }

  adjustedScreenSize(){
    if (window.innerWidth>770) {
      return <>
        <div className="row input-container">
          <div className="col-md-4">
            <Button variant="primary" style={{ margin: "20px" }} onClick={this.showModal}>Create Team</Button>
          </div>
          <div className="col-md-2">
            <Form.Label htmlFor="displayFormat">Format</Form.Label>
            <Form.Select size="sm" style={{ width: "100px" }}
              onChange={() => this.setSelectedDisplayFormat()} ref={this.selectInput}>
              <option>Months</option>
              <option>Weeks</option>
            </Form.Select>
          </div>
          <div className="col-md-2">
            {this.weeksMonthsNumber()}
          </div>
          <div className="col-md-4">
            <Button variant="secondary" style={{ margin: "20px", float:"right" }} onClick={this.generateReport}>Generate Report</Button>
          </div>
        </div>
      </>;
    }
    return <div className='input-container'>
      <div className="small-screen-input">
        <Button variant="primary" style={{ margin: "10px" }} onClick={this.showModal}>Create Team</Button>
      </div>
      <div className="small-screen-input">
        <div className='small-screen-select'>
          <Form.Label htmlFor="displayFormat">Format</Form.Label>
          <Form.Select size="sm" style={{ width: "100px" }}
            onChange={() => this.setSelectedDisplayFormat()} ref={this.selectInput}>
            <option>Months</option>
            <option>Weeks</option>
          </Form.Select>
        </div>
        <div className='small-screen-select'>
          {this.weeksMonthsNumber()}
        </div>
      </div>
      <div className="small-screen-input">
        <Button variant="secondary" style={{ margin: "10px"}} onClick={this.generateReport}>Generate Report</Button>
      </div>
    </div>;
  }


  
  render() {
    if (selectedTeam === "") selectedTeam = this.props.teams[0];

    const listTeam = this.props.teams.map((team) => {
      if (team === selectedTeam) {
        return <div key={team} className="selected-list-item">
          <p key={team} onClick={() => this.setSelectedTeam(team)}>{team}</p>
        </div>
      }
      return <div key={team} className="list-item">
        <p key={team} onClick={() => this.setSelectedTeam(team)}>{team}</p>
      </div>
    });

    return (<>
      <Modal show={this.state.show} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label htmlFor="inputPassword5">Team Name</Form.Label>
          <Form.Control
            id="teamName"
            placeholder="Enter a team name.."
            ref={this.textInput}
            onChange={() => this.getModalFormChanges()}
          />
          {this.ErrorDisplaying()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.hideModal}>
            Close
          </Button>
          <Button variant="primary" onClick={this.submitModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container-fluid">
        {this.adjustedScreenSize()}
        <div className='row'>
          <h3>Teams</h3>
          <div id="team" className="col-md-2 scroll-container">
            {listTeam}
          </div>
          {this.reportGenerated()}
        </div>
      </div>
    </>
    );
  }
}
export default Teams;