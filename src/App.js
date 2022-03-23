import './App.css';
import React, { useEffect, useState } from 'react';
import Teams from './components/Teams'
import Loading from './components/Loading';

class App extends React.Component {
  state = { teams: [], loaded: false }
  constructor() {
    super();
  }
  componentDidMount() {
    const apiUrl = 'http://stubber.test.visiblethread.com/teams/allNames';
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Retrieved team data: ", data);
        this.setState({teams: data, loaded: true});
      });
  }

  render(){
    const dataLoaded = () => {
      console.log("snkda");
      if (this.state.loaded) { 
        return <Teams teams={this.state.teams}/>; 
      }
      return <Loading />;
    }

    return (
      <div className="app-container">
        <div className="header-container">
          Visible Thread Frontend
        </div>
        <div className='team-container'>
          {dataLoaded()}
        </div>
      </div>
    );
  }
}

export default App;
