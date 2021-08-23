/* global document, console */
/* eslint-disable no-console, no-unused-vars, no-undef */
import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import CameraPanel from './camera-panel';

import { ThemeProvider } from '@streetscape.gl/monochrome';

import { setXVIZConfig, getXVIZConfig } from '@xviz/parser';
//import {ScatterplotLayer} from 'deck.gl';
import MapView from './map-view';

import {
  LogViewer,
  PlaybackControl,
  StreamSettingsPanel,
  MeterWidget,
  TrafficLightWidget,
  TurnSignalWidget,
  XVIZPanel,
  VIEW_MODE,
} from 'streetscape.gl';
import { Form } from '@streetscape.gl/monochrome';

import { XVIZ_CONFIG, APP_SETTINGS, MAPBOX_TOKEN, MAP_STYLE, XVIZ_STYLE, CAR } from './constants';

import { UI_THEME, STREAM_SETTINGS_STYLE } from './custom-styles';


setXVIZConfig(XVIZ_CONFIG);

const TIMEFORMAT_SCALE = getXVIZConfig().TIMESTAMP_FORMAT === 'seconds' ? 1000 : 1;

const exampleLog = require('./log-from-stream').default;

const OBJECT_ICONS = {
  Walkers:'pedestrian',
  Vehicles:'car',
  '2Wheels':'bike',

  Vehicle:'car',


  OBJECT:'car',
  Car: 'car',
  Van: 'bus',
  Pedestrian: 'pedestrian',
  Cyclist: 'bike'
};



const renderObjectLabel = ({ id, object, isSelected }) => {
  if (isSelected) {
    debugger;
  }
  const feature = object.getFeature('/tracklets/objects');
  if (!feature) {
    return isSelected && <b>{id}</b>;
  }
  else {
    debugger
  }

  const { classes } = feature.base;

  if (isSelected) {
    debugger
    return (
      <div>
        <div>
          <div>1111111111111111111111111</div>
          <b>{id}</b>
        </div>
        <div>{classes.join(' ')}</div>
      </div>
    );
  }

  const objectType = classes && classes.join('');
  if (objectType in OBJECT_ICONS) {
    return (
      <div>
        <h1>asdasdasdasdasdasdasd</h1>
        <i className={`icon-${OBJECT_ICONS[objectType]}`} />
      </div>
    );
  }

  return null;
};

class Example extends PureComponent {

  state = {
    floatingWindowScale: 100,
    log: exampleLog,
    settings: {
      viewMode: 'PERSPECTIVE',
      showTooltip: false,
    },
    viewState: {
      altitude: 1.5,
      bearing: 72.93234514293981,
      height: 1088,
      latitude: 49.01128254711867,
      longitude: 8.422956503971733,
      maxPitch: 85,
      maxZoom: 24,
      minPitch: 0,
      minZoom: 12,
      pitch: 79.46287171948006,
      width: 916,
      zoom: 20.66447915671683
    },
    viewOffset: { bearing: -78.88, x: 5.56, y: 142.16 }
  };

  componentDidMount() {
    this.state.log.on('error', console.error).connect();
    this.state.settings.viewMode= 'PERSPECTIVE';
    this.setState({...this.state})
  }

  _onSettingsChange = changedSettings => {
    // debugger
    this.setState({
      settings: { ...this.state.settings, ...changedSettings }
    });
  };

  onViewStateChange = ({ viewState, viewOffset }) => {
    // debugger
    // if (this.state.settings.viewMode === 'PERSPECTIVE') {
    //    viewOffset = { ...viewOffset, x: -82, y: -14, bearing: -87 };
    //   //  viewState = {...viewState,zoom:22}
    // }
    // else if (this.state.settings.viewMode === 'DRIVER') {
    //   viewOffset = { ...viewOffset, x: 90, y: 20, bearing: -90 };
    // }
    // console.log(viewOffset)
    // 
    // console.log(viewState);
    // debugger;

    this.setState({ ...this.state, viewState, viewOffset })
  }




  render() {
    const { log, settings, selectedLog } = this.state;
  
    return (
      <div id="container">
        <div id="control-panel" >
          <Form
            data={APP_SETTINGS}
            values={this.state.settings}
            onChange={this._onSettingsChange}
          />
          <StreamSettingsPanel log={log} style={STREAM_SETTINGS_STYLE} />

          <div style={{ color: 'white', marginTop: '16px' }}>
            <div> Change Video Size: </div>
            <input id="videoResizer" type="range" min="50" max="150" value={this.state.floatingWindowScale} onChange={(e) => {
              this.setState({
                ...this.state,
                floatingWindowScale: e.currentTarget.value
              })
            }} />
          </div>

        </div>
        <div id="log-panel">
          <div id="map-view" >
            {/* <MapView log={log} settings={this.state.settings} onViewStateChange={this.onViewStateChange} />  */}
            <LogViewer
              log={log}

              mapboxApiAccessToken={MAPBOX_TOKEN}
              mapStyle={MAP_STYLE}
              viewState={this.state.viewState}
              viewOffset={this.state.viewOffset}
              // onViewOffsetChange={()=>{debugger}}
              onViewStateChange={this.onViewStateChange}
              car={CAR}
              xvizStyles={XVIZ_STYLE}
              showTooltip={settings.showTooltip}
              viewMode={VIEW_MODE[settings.viewMode]}
             renderObjectLabel={renderObjectLabel}
            />

            <CameraPanel log={log} videoAspectRatio={10 / 3} floatingWindowScale={this.state.floatingWindowScale} />
          </div>
          <div id="timeline"  >
            <PlaybackControl
              width="100%"
              log={log}
              formatTimestamp={x => new Date(x * TIMEFORMAT_SCALE).toUTCString()}
            />
          </div>
        </div>
      </div>
    );
  }
}

render(
  <ThemeProvider theme={UI_THEME}>
    <Example />
  </ThemeProvider>
  , document.getElementById('app'));
