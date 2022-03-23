import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
const axios = require('axios');
// import './../Teams.css';

let showError = false;

class Teams extends React.Component {
  showModal = () => {
    this.setState({ show: true});
  };

  hideModal = () => {
    this.setState({ show: false});
    showError = false;
  };
  
  setName = (inputName) => {
    this.setState({ show: this.state.show});
  };

  constructor() {
    super();
    this.state = { show: false }
    this.textInput = React.createRef(); 
  }

  getFormChanges = () => {
    console.log("input", this.textInput.current.value);
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

  submitModal = () => {
    // Post team
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: {team: JSON.stringify("test team post")}
      };
      
      // fetch("http://stubber.test.visiblethread.com/teams/add", requestOptions)
      //   .then((res) => res.json())
      //   .then((result) => {
      //     console.log("HERE", result);
      //   });
      axios.post('http://stubber.test.visiblethread.com/teams/add', "Team test")
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    } catch (e) {
      console.log("Error logging in: ", e.message);
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
            onChange={() => this.getFormChanges()}
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
            <Button variant="primary" style={{float:"left"}} onClick={this.showModal}>Create Team</Button>
          </div>
          <div className="col-md-6">
            <Button variant="secondary" style={{float:"right"}} onClick={this.hideModal}>Generate Report</Button>
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