import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import moment from 'moment';

import Map from './componets/Map';
import Header from './componets/Header';
import './App.css';

const CATALOG = {
  36: 'residential burglary',
  34: 'violations',
  20: 'simple assault',
  19: 'auto theft',
  41: 'aggravated assault',
  57: 'larceny',
  42: 'robbery',
};

const URL_BASE = 'http://localhost:3001';

class App extends Component {
  state = { fetching: false };

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

  handlePredictionOnClick = async () => {
    const { hour, day, month, gridId } = this.state;

    try {
      this.setState({ fetching: true, crimesBy: null, offenseGroup: null });

      const urlCrimesPredict = `${URL_BASE}/api/crimes/predict/${hour}/${day}/${month}/${gridId}`;
      const { group_id } = await this.handleGetCall(urlCrimesPredict);

      const urlCrimesBy = `${URL_BASE}/api/crimes/by/${group_id}/${hour}/${day}/${month}/${gridId}`;
      const crimesBy = await this.handleGetCall(urlCrimesBy);
      const offenseGroup = CATALOG[group_id];

      this.setState(state => ({
        crimesBy,
        offenseGroup,
        headerText: `${state.headerText} - ${offenseGroup}`,
        fetching: false,
      }));
    } catch (error) {
      console.error(error);
      this.setState({ crimesBy: null, offenseGroup: null, fetching: false });
    }
  };

  async componentDidMount() {
    const urlGrid = `${URL_BASE}/api/grid`;
    const urlCrimesSample = `${URL_BASE}/api/crimes/sample`;

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
    const {
      fetching,
      grid,
      headerText,
      crimesSample,
      gridId,
      crimesBy,
    } = this.state;
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
              crimesBy={crimesBy}
              handlerGetInputsOnClick={this.handlerGetInputsOnClick}
            />
          )}
        </div>
        <p>
          <button onClick={this.handlePredictionOnClick} disabled={!gridId}>
            PREDICTION
          </button>
        </p>
      </div>
    );
  }
}

export default App;
