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

import React, { useState, useEffect, Fragment } from 'react';
import { StreamSettingsPanel, XVIZPanel } from 'streetscape.gl';

import { XVIZ_PANEL_STYLE, STREAM_SETTINGS_STYLE } from './custom-styles';
import MetadataPanel from './metadata-panel';
import HelpPanel from './help-panel';

const ControlPanel = (props) => {
  const [state, setState] = useState({
    tab: 'streams'
  });
  const [timestamps, setTimestamps] = useState([]);
  const [timestampLabel, setTimestampLabel] = useState('');
  const [showErrorMsg, setShowErrorMsg] = useState(false);

  useEffect(() => {
    const timestampsStr = localStorage.getItem('timestamps');
    if (timestampsStr) {
      const _timestamps = JSON.parse(timestampsStr);
      if (_timestamps && _timestamps[0]) {
        setTimestamps(_timestamps);
      }
    }
  }, []);

  useEffect(() => {
    const timestampsStr = `${JSON.stringify(timestamps)}`;
    localStorage.setItem('timestamps', timestampsStr);
  }, [timestamps])


  const _gotoTab = (tab) => {
    setState({ tab, lastTab: state.tab });
  }

  const _renderTabContent = () => {
    const { log, selectedLog, onLogChange } = props;

    switch (state.tab) {
      case 'streams':
        return <StreamSettingsPanel log={log} style={STREAM_SETTINGS_STYLE} />;

      case 'charts':
        return (
          <XVIZPanel
            log={log}
            name="Metrics"
            style={XVIZ_PANEL_STYLE}
            componentProps={{
              metric: { getColor: '#ccc' }
            }}
          />
        );

      case 'info':
        return <MetadataPanel log={log} selectedLog={selectedLog} onLogChange={onLogChange} />;

      case 'help':
        return <HelpPanel />;

      default:
        return null;
    }
  }

  const _renderTab = ({ id, description }) => {
    const { tab } = state;

    return (
      <div className={`tab ${id === tab ? 'active' : ''}`} onClick={() => _gotoTab(id)}>
        {id}
      </div>
    );
  }

  const { tab } = state;
  const log = props.log;

  const isHelpOpen = tab === 'help';

  const addTimestamp = () => {
    if (timestampLabel !== '') {// && !isInTimestampsArr(timestampLabel)){
      const currentTime = log.getCurrentTime();
      setTimestamps([...timestamps, { time: currentTime, label: timestampLabel }]);
      setTimestampLabel('');
    }
    else {
      setShowErrorMsg(true);
      setTimeout(() => {
        setShowErrorMsg(false);
      }, 3000)
    }

  }

  const removeTimestamp = (timestampLabel) => {
    const filteredTimestamps = timestamps.filter((_timestamp) => _timestamp.label !== timestampLabel);
    setTimestamps(filteredTimestamps);
  }


  return (
    <Fragment>
      <div id="logo">
        <a href="../index.html">
          <img src="assets/logo.png" />
        </a>
      </div>

      <div id="control-panel">


        {
          // <header>
          //   <div id="logo">
          //     <a href="../index.html">
          //       <img src="assets/logo.png" />
          //     </a>
          //   </div>

          //   <div id="help-btn">
          //   {HelpPanel.renderButton({
          //     isOpen: isHelpOpen,
          //     onClick: () => _gotoTab(isHelpOpen ? state.lastTab : 'help')
          //   })}
          // </div>
          // {!isHelpOpen && (
          //   <div id="tabs">
          //     {/* {this._renderTab({id: 'info', description: 'Log Info'})} */}
          //     {_renderTab({ id: 'streams', description: 'Stream Settings' })}
          //     {/* {this._renderTab({id: 'charts', description: 'Charts'})} */}
          //   </div>
          // )}

          //      </header>

        }
        <main>

  

          <div>
            <div id="timestamps">
              <h3><u>Highlights:</u></h3>

              <div className="timestamps-form">
                <input placeholder="Timestemp Label" className="timestamps-form-item" type="text" value={timestampLabel} onChange={(e) => { setTimestampLabel(e.currentTarget.value) }} />
                <button className="timestamps-form-item" onClick={addTimestamp}>Add Timestamp</button>
              </div>

              <div style={{ opacity: showErrorMsg ? 1 : 0 }}>Please add timestamp label</div>

              <div className="timestamps-container">
                {timestamps[0] &&
                  timestamps.map((timestamp) =>
                    <div className="timestamp-item-container" key={timestamp.label}>
                      <div className="timestamp-item">
                        <div className="timestamp-text" onClick={() => {
                          log.seek(timestamp.time)
                        }}>
                          {timestamp.label}
                        </div>
                        <div onClick={() => { removeTimestamp(timestamp.label) }}>X</div>
                      </div>
                    </div>
                  )
                }

              </div>

            </div>


          </div>

          <div id="videoResizer-container">
            <h3 style={{marginBottom:0}}><u> Change Video Size: </u></h3>
            <input id="videoResizer" type="range" min="50" max="150" value={props.floatingWindowScale} onChange={props.handleVideoResize} style={{ cursor: "pointer" }} />
          </div>


          <h3><u>Map Options:</u></h3>

          {_renderTabContent()}

        </main>

      </div>

    </Fragment>



  );
}
export default ControlPanel;
