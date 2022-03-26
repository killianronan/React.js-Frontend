import React from 'react';
import { Grid } from 'react-loader-spinner';

class Loading extends React.Component {

  render() {
    return (<Grid ariaLabel="loading-indicator" />);
  }
}
export default Loading;