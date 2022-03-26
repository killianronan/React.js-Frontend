import './App.css';
import React from 'react';
import Teams from './components/Teams'
import Loading from './components/Loading';

class App extends React.Component {
  state = { teams: [], loaded: false }
  
  async fetchTeams() {
    const apiUrl = 'http://stubber.test.visiblethread.com/teams/allNames';
    const response = await fetch(apiUrl);
    return response.json();
  }

  async fetchReport() {
    const apiUrl = 'http://stubber.test.visiblethread.com/scans/monthly/12';
    const response = await fetch(apiUrl);
    return response.json();
  }


  componentDidMount() {
    this.fetchTeams().then(result => {
      this.setState({ teams: result, loaded: true });
    });
  }

  render() {
    const dataLoaded = () => {
      if (this.state.loaded) {
        return <Teams teams={this.state.teams} />;
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
