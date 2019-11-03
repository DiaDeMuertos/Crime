import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import moment from 'moment';

import Map from './componets/Map';
import Header from './componets/Header';
import './App.css';

class App extends Component {
  state = { grid: null, fetching: false, crimesSample: null };

  handlerGetInputsOnClick = gridId => {
    const date = moment();
    const day = date.days();
    const month = date.month();
    const hour = date.hours();

    const headerText = `${date.format('HH ddd MMM')} ${gridId}`;

    this.setState({
      headerText,
      hour,
      day,
      month,
      gridId,
    });
  };

  handleGetCall = url =>
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const payload = data.payload;
          return payload;
        }
      });

  handlePredictionOnClick = async() => {
    const { hour, day, month, gridId } = this.state;

    const urlCrimesPredict = `http://localhost:3001/api/crimes/predict/${hour}/${day}/${month}/${gridId}`;

    const crimesPredict = await this.handleGetCall(urlCrimesPredict);

    console.log(crimesPredict)

  };

  async componentDidMount() {
    const urlGrid = 'http://localhost:3001/api/grid';
    const urlCrimesSample = 'http://localhost:3001/api/crimes/sample';

    try {
      this.setState({ fetching: true, headerText: null });

      const grid = await this.handleGetCall(urlGrid);
      const crimesSample = await this.handleGetCall(urlCrimesSample);

      this.setState({ grid, crimesSample, fetching: false });
    } catch (error) {
      console.error(error);
      this.setState({ grid: null, crimesSample: null, fetching: false });
    }
  }

  render() {
    const { fetching, grid, headerText, crimesSample, gridId } = this.state;
    const appMapContainerStyle = `App-map-container ${
      fetching ? 'App-map-container-loader' : null
    }`;

    return (
      <div className="App">
        <Header text={headerText} />
        <div className={appMapContainerStyle}>
          <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            visible={fetching}
          />
          {!fetching && (
            <Map
              grid={grid}
              crimesSample={crimesSample}
              handlerGetInputsOnClick={this.handlerGetInputsOnClick}
            />
          )}
        </div>
        <p>
          <button onClick={this.handlePredictionOnClick} disabled={!gridId}>PREDICTION</button>
        </p>
      </div>
    );
  }
}

export default App;
