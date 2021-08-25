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

import React, { useEffect, useState } from 'react';

import { LogViewer, VIEW_MODE } from 'streetscape.gl';

import { MAPBOX_TOKEN, MAP_STYLE, CAR } from './constants';
import { XVIZ_STYLE, LOG_VIEWER_STYLE } from './custom-styles';

const OBJECT_ICONS = {
  Vehicles: 'car',
  Walkers: 'pedestrian',
  '2Wheels': 'bike',
  Car: 'car',
  Van: 'bus',
  Pedestrian: 'pedestrian',
  Cyclist: 'bike'
};

// const getLabel = (id, log) => {
//   //debugger
//       let label = 'car';
//       const currentObject = log.getCurrentFrame().features['/tracklets/objects'].filter(({ id: _id }) => _id.includes(id))[0];
//       label = OBJECT_ICONS[currentObject?.id?.split(" ")[0]];
//       return label
// }


//const renderObjectLabel = ({id, object, isSelected}) => {
const renderObjectLabel =  ({ id, object, isSelected, log }) => {
  const currentFrame = log.getCurrentFrame();
  const feature = currentFrame?.features['/tracklets/objects']?.filter(({ id: _id }) => _id.includes(id))[0];
  

  if (!feature) {
    return isSelected && <b>{id}</b>;
  }
  
  const featureData = currentFrame?.streams['/tracklets/label']?.features.filter(({ id: _id }) => _id.includes(id));

  const { classes } = feature.base;
  const objectId = featureData[2]?.text;
    if (isSelected) {
      return (
        <div>
          <div>
            <b>{objectId}</b>
          </div>
          <div></div>
        </div>
      );
    }

  const objectType = classes;
  
  const confidence = featureData[1]?.text;

  

  if (objectType in OBJECT_ICONS) {
    return (
      <div >
        <i className={`icon-${OBJECT_ICONS[objectType]}`} /> {confidence ? ` | ${confidence}%` : ''}
      </div>
    );
  }

  return null;
};





const MapView = (props) => {
  
  const {log,settings} = props;

  const _onViewStateChange = ({ viewOffset }) => {
    props.onSettingsChange({ viewOffset });
  };

  return (
    <LogViewer
      log={log}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      mapStyle={MAP_STYLE}
      car={CAR}
      xvizStyles={XVIZ_STYLE}
      style={LOG_VIEWER_STYLE}
      showTooltip={settings.showTooltip}
      viewMode={VIEW_MODE[settings.viewMode]}
      viewOffset={settings.viewOffset}
      onViewStateChange={_onViewStateChange}
      renderObjectLabel={({ id, object, isSelected }) => renderObjectLabel({ id, object, isSelected, log })}
    />
  );
}
export default MapView;


