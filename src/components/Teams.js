import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
// import './../Teams.css';

let showError = false;
let monthsShowing = true;
let months = [1,2,3,4,5,6,7,8,9,10,11,12]
let weeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
  21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,
  41,42,43,44,45,46,47,48,49,50,51,52]

const listWeek = weeks.map((week) =><option key={week}>{week}</option>);
const listMonth = months.map((month) =><option key={month}>{month}</option>);

class Teams extends React.Component {
  showModal = () => {
    this.setState({ show: true});
  };

  hideModal = () => {
    this.setState({ show: false});
    showError = false;
  };

  constructor() {
    super();
    this.state = { show: false }
    this.textInput = React.createRef(); 
    this.selectInput = React.createRef(); 
  }

  getModalFormChanges = () => {
    const isDuplicate = (element) => element == this.textInput.current.value;
    if(this.props.teams.findIndex(isDuplicate)>-1){
      showError = true;
      this.setState({ show: this.state.show});
    }
    else{
      showError = false;
      this.setState({ show: this.state.show});
    }
  };

  setSelectedDisplayFormat = () => {
    if(this.selectInput.current.value=="Weeks"){
      monthsShowing = false;
      this.setState({ show: this.state.show});
    }
    else{
      monthsShowing = true;
      this.setState({ show: this.state.show});
    }
  }

  submitModal = () => {
    // Post team
    if(this.textInput.current.value.length>0 && !showError){
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
          body: JSON.stringify(this.textInput.current.value)
        };
        
        fetch("http://stubber.test.visiblethread.com/teams/add", requestOptions)
          .then((res) => res.json())
          .then((result) => {
            console.log("Post Result: ", result);
          });
      } catch (e) {
        console.log("Error logging in: ", e.message);
      }
    }
  };

  render() {
    const listTeam = this.props.teams.map((teamName) =><li key={teamName}>{teamName}</li>);
    
    const ErrorDisplaying = () => {
      if (!showError) { 
        return <Form.Text id="teamHelpBlock" muted>
        No duplicate team names allowed.
      </Form.Text> ; 
      }
      return <Form.Text id="teamHelpBlock" style={{color: "red"}}>
      Duplicate team name entered.
    </Form.Text> ;
    }

    const weeksMonthsDisplaying = () => {
      if (!monthsShowing) { 
        return <><Form.Label htmlFor="timePeriod">Weeks</Form.Label>
        <Form.Select size="sm" style={{width: "100px"}}>
          {listWeek}
        </Form.Select></>;
      }
      return <><Form.Label htmlFor="timePeriod">Months</Form.Label>
      <Form.Select size="sm" style={{width: "100px"}}>
        {listMonth}
      </Form.Select></>;
    }

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
          {ErrorDisplaying()}
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
        <div className="row">
          <div className="col-md-6">
            <Button variant="primary" style={{float:"left", margin: "20px"}} onClick={this.showModal}>Create Team</Button>
          </div>
          <div className="col-md-2">
            <Form.Label htmlFor="displayFormat">Display Format</Form.Label>
            <Form.Select size="sm" style={{width: "100px"}}
              onChange={() => this.setSelectedDisplayFormat()} ref={this.selectInput}>
              <option>Months</option>
              <option>Weeks</option>
            </Form.Select>
          </div>
          <div className="col-md-2">
            {weeksMonthsDisplaying()}
          </div>
          <div className="col-md-2">
            <Button variant="secondary" style={{float:"left", margin: "20px"}} onClick={this.showModal}>Generate Report</Button>
          </div>
        </div>
        <h1>Teams</h1>
        <div>
          <ul>
            {listTeam}
          </ul>
        </div>
      </div>
    </>
    );
  }
}
export default Teams;