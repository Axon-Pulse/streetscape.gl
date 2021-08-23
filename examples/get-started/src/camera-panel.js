
/* global window */
import React, { PureComponent } from 'react';
import { XVIZPanel } from 'streetscape.gl';
import { FloatPanel } from '@streetscape.gl/monochrome';

import { XVIZ_PANEL_STYLE, FLOAT_PANEL_STYLE } from './custom-styles';

const TITLE_HEIGHT = 28;
const LEFT_PANEL_WIDTH = 320;
const TIMLINE_HEIGHT = 119;
const PANEL_HEIGHT = 148 * 1.5;
const PANEL_WIDTH = 400 * 1.5;
export default class CameraPanel extends PureComponent {
  state = {
    panelState: {
      x: LEFT_PANEL_WIDTH + 16,
      y: window.innerHeight - TIMLINE_HEIGHT - 16 - PANEL_HEIGHT,
      width: PANEL_WIDTH,
      height: PANEL_HEIGHT,
      minimized: false
    }
  };

  componentWillReceiveProps(nextProps) {
    
    const { panelState } = this.state;
    if (this.props.videoAspectRatio !== nextProps.videoAspectRatio) {
      
      this.setState({
        panelState: {
          ...panelState,
          height: panelState.width / nextProps.videoAspectRatio + TITLE_HEIGHT
        }
      });
    }
    this.scale(nextProps.floatingWindowScale)
  }

  _onUpdate = panelState => {
    const { videoAspectRatio } = this.props;
    this.setState({
      panelState: {
        ...panelState,
        height: panelState.width / videoAspectRatio + TITLE_HEIGHT
      }
    });
  };

   scale =(scale) => {
    scale = (parseInt(scale)/100);
     this.setState({
       panelState: {
         x: LEFT_PANEL_WIDTH + 16,
         y: window.innerHeight - TIMLINE_HEIGHT - 16 - PANEL_HEIGHT*scale,
         width: PANEL_WIDTH * scale,
         height: PANEL_HEIGHT * scale,
         minimized: false
       }
     })
   }
  render() {
    const { log } = this.props;
    const { panelState } = this.state;

    return (
      <div>

        <FloatPanel
          {...panelState}
          movable={true}
          minimizable={false}
          resizable={true}
          onUpdate={this._onUpdate}
          style={{ left: 16 }}
        >


          <XVIZPanel log={log} name="Camera" style={XVIZ_PANEL_STYLE} />
        </FloatPanel>
      </div>

    );
  }
}
