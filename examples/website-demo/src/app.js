// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* global document */
import React, { PureComponent } from 'react';
import { render } from 'react-dom';

import { setXVIZConfig } from '@xviz/parser';
import { XVIZFileLoader } from 'streetscape.gl';
import { ThemeProvider } from '@streetscape.gl/monochrome';

import ControlPanel from './control-panel';
import CameraPanel from './camera-panel';
import MapView from './map-view';
import Timeline from './timeline';
import Toolbar from './toolbar';
import HUD from './hud';
import NotificationPanel from './notification-panel';
import isMobile from './is-mobile';
import { XVIZStreamLoader } from 'streetscape.gl';

import { LOGS, MOBILE_NOTIFICATION } from './constants';
import { UI_THEME } from './custom-styles';

import './stylesheets/main.scss';

class Example extends PureComponent {
  state = {
    floatingWindowScale: 100,
    ...(!isMobile && this._loadLog(LOGS[0])),
    settings: {
      viewMode: 'PERSPECTIVE',
      showTooltip: false,
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
      viewOffset: { bearing: 0, x: 0, y: 180 }
    },

  };

  _loadLog(logSettings) {
    if (logSettings.xvizConfig) {
      setXVIZConfig(logSettings.xvizConfig);
    }

    const loader = new XVIZStreamLoader({
      logGuid: 'mock',
      // bufferLength: 15,
      serverConfig: {
        defaultLogLength: 30,
        serverUrl: 'ws://localhost:8083'
      },
      worker: true,
      maxConcurrency: 4
    }).on('ready', () =>
      loader.updateStreamSettings({
        '/tracklets/label': true,
        // '/vehicle/':false
      })
    )
      .on('error', console.error); // eslint-disable-line

    loader.connect();

    return { selectedLog: logSettings, log: loader };
  }

  _onLogChange = selectedLog => {
    this.state.log.close();
    this.setState(this._loadLog(selectedLog));
  };

  _onSettingsChange = changedSettings => {
    if (changedSettings.viewMode === "TOP_DOWN") {
      this.setState({
        settings: {
          ...this.state.settings,
          viewOffset: {
            bearing: 159.64285714285708,
            x: 158.33965394894267,
            y: 207.79062493642164
          },
          ...changedSettings
        }
      });

    }
    else {
      this.setState({
        settings: { ...this.state.settings, ...changedSettings }
      });
    }
  };

  handleVideoResize = (e) => {

    this.setState({
      ...this.state,
      floatingWindowScale: e.currentTarget.value
    })

  }


  render() {
    if (isMobile) {
      return <NotificationPanel notification={MOBILE_NOTIFICATION} />;
    }

    const { log, selectedLog, settings } = this.state;
    return (
      <div id="container">
        <MapView log={log} settings={settings} onSettingsChange={this._onSettingsChange} />

        <ControlPanel selectedLog={selectedLog} onLogChange={this._onLogChange} log={log}
          handleVideoResize={this.handleVideoResize}
          floatingWindowScale={this.state.floatingWindowScale} />

        <HUD log={log} showHud={false} />

        <Timeline log={log} />

        <Toolbar settings={settings} onSettingsChange={this._onSettingsChange} />

        {/* <CameraPanel log={log} videoAspectRatio={selectedLog.videoAspectRatio} />   */}
        <CameraPanel log={log} videoAspectRatio={1920 / 1080} floatingWindowScale={this.state.floatingWindowScale} />
      </div>
    );
  }
}

const root = document.createElement('div');
document.body.appendChild(root);

render(
  <ThemeProvider theme={UI_THEME}>
    <Example />
  </ThemeProvider>,
  root
);
