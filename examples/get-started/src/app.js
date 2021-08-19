/* global document, console */
/* eslint-disable no-console, no-unused-vars, no-undef */
import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import CameraPanel from './camera-panel';

import {ThemeProvider} from '@streetscape.gl/monochrome';

import {setXVIZConfig, getXVIZConfig} from '@xviz/parser';
import {
  LogViewer,
  PlaybackControl,
  StreamSettingsPanel,
  MeterWidget,
  TrafficLightWidget,
  TurnSignalWidget,
  XVIZPanel,
  VIEW_MODE
} from 'streetscape.gl';
import {Form} from '@streetscape.gl/monochrome';

import {XVIZ_CONFIG, APP_SETTINGS, MAPBOX_TOKEN, MAP_STYLE, XVIZ_STYLE, CAR} from './constants';

import {UI_THEME, STREAM_SETTINGS_STYLE} from './custom-styles';


setXVIZConfig(XVIZ_CONFIG);

const TIMEFORMAT_SCALE = getXVIZConfig().TIMESTAMP_FORMAT === 'seconds' ? 1000 : 1;
const isMobile = false;
// __IS_STREAMING__ and __IS_LIVE__ are defined in webpack.config.js
// const exampleLog = require(__IS_STREAMING__
//   ? './log-from-stream'
//   : __IS_LIVE__
//     ? './log-from-live'
//     : './log-from-file').default;

    const exampleLog = require('./log-from-stream').default;

class Example extends PureComponent {



  // _onLogChange = selectedLog => {
  //   this.state.log.close();
  //   this.setState(this._loadLog(selectedLog));
  // };



   state = {
     floatingWindowScale:100,
     log: exampleLog,
     settings: {
       viewMode: 'PERSPECTIVE',
       showTooltip: false
     },
    viewState: null,
    viewOffset: {x: -82, y: -14, bearing: -87}
   };

  componentDidMount() {
    this.state.log.on('error', console.error).connect();
  }

  _onSettingsChange = changedSettings => {
    this.setState({
      settings: {...this.state.settings, ...changedSettings}
    });
  };

  render() {
    const {log, settings, selectedLog} = this.state;
    
    return (
      <div id="container">
        <div id="control-panel" >
            <Form
            data={APP_SETTINGS}
            values={this.state.settings}
             onChange={this._onSettingsChange}
          />  
          <StreamSettingsPanel log={log} style={STREAM_SETTINGS_STYLE}  />
          
          <div style={{color:'white',marginTop:'16px'}}> 
            <div> Change Video Size: </div>
            <input id="videoResizer" type="range" min="50" max="150" value={this.state.floatingWindowScale} onChange={(e)=>{
              this.setState({
                ...this.state,
                floatingWindowScale:e.currentTarget.value
              })
              }}/>
          </div>

        </div>
        <div id="log-panel">
          <div id="map-view" >
            <LogViewer
              log={log}
             // mapboxApiAccessToken={MAPBOX_TOKEN}
             // mapStyle={MAP_STYLE}
             viewState={this.state.viewState}
             viewOffset={this.state.viewOffset}
             onViewStateChange={({viewState, viewOffset}) => {
                console.log(this.state.viewOffset)
                this.setState({viewState, viewOffset})
              }}
              car={CAR}
              xvizStyles={XVIZ_STYLE}
              showTooltip={settings.showTooltip}
              viewMode={VIEW_MODE[settings.viewMode]}
            />
        
             <CameraPanel log={log}  videoAspectRatio={10/3} floatingWindowScale={this.state.floatingWindowScale} />
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
