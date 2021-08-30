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
import { PlaybackControl } from 'streetscape.gl';

import { PLAYBACK_CONTROL_STYLE } from './custom-styles';

const formatTimestamp = x => new Date(x * 1000).toUTCString();
export default class Timeline extends PureComponent {
  state = {
    isPlaying: false,
    isSlower: false,
  };

  componentDidMount() {
    document.addEventListener('keydown', this._onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._onKeyDown);
  }

  _seek(delta) {
    const { log } = this.props;
    const startTime = log.getLogStartTime();
    const endTime = log.getLogEndTime();
    let timestamp = log.getCurrentTime();

    if (Number.isFinite(timestamp)) {
      timestamp += delta;
      if (timestamp < startTime) {
        timestamp = startTime;
      }
      if (timestamp > endTime) {
        timestamp = endTime;
      }
      log.seek(timestamp);
    }
  }

  _onPlay = () => {
    clearInterval(this.manualPlayerInterval);
    this.setFramesUpdateRate({frameRate:100, isSlower:false})
    // this.setState({ isPlaying: true });
  }
  _onPause = () => {
    clearInterval(this.manualPlayerInterval);
    this.setState({ isPlaying: false });
  }

  _onKeyDown = evt => {
    // evt.stopPropagation();
    switch (evt.keyCode) {
      case 32: // space
      if(evt.target.className !== 'player-button'){
        if (this.state.isPlaying) {

          this._onPause();
        } else {
          this._onPlay();
        }
      }
        break;

      case 37: // left
        this._seek(-0.1);
        break;

      case 39: // right
        this._seek(0.1);
        break;

      default:
    }
  };

  setFramesUpdateRate = ({frameRate, isSlower}) => {
    const endTime = this.props.log.getLogEndTime();
    const startTime = this.props.log.getLogStartTime();
    this.setState({ isPlaying: true, isSlower})

    clearInterval(this.manualPlayerInterval)
    this.manualPlayerInterval = setInterval(() => {
      if (this.props.log.getCurrentTime() === endTime) {
        clearInterval(this.manualPlayerInterval);
        this.setState({...this.state, isPlaying: false})
        this.props.log.seek(startTime);
      }
      this._seek(0.1);
    }, frameRate)
  }

  render() {
    const { log } = this.props;
    const { isPlaying } = this.state;
    return (
      <div id="timeline">
        <PlaybackControl
          compact={false}
          style={PLAYBACK_CONTROL_STYLE}
          // isPlaying={isPlaying}
          onPlay={this._onPlay}
          onPause={this._onPause}
          onSeek={this._onSeek}
          width="100%"
          log={log}
          formatTimestamp={formatTimestamp}

        />
        <span id="player">


          {
            this.state.isPlaying
              ?
              <button className="player-button" onClick={() => {
                this._onPause();
              }}>
                <svg width="100%" className="pauseIcon" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
              </button>

              :
              <button className="player-button" onClick={() => {
                this._onPlay();
              }}>
                <svg width="100%" className="playIcon" viewBox="0 0 24 24" ><path d="M8 5v14l11-7z"></path></svg>
              </button>
          }

          {
            this.state.isPlaying &&
            (
              this.state.isSlower
              ?
              <button className="player-speed-button" onClick={() => {
                this.setFramesUpdateRate({frameRate:100,isSlower:false})
              }}>Normal</button>
              :
              <button className="player-speed-button" onClick={() => {
                this.setFramesUpdateRate({frameRate:300,isSlower:true})
              }}>Slower</button>
            )
          }
        </span>

      </div>
    );
  }
}
