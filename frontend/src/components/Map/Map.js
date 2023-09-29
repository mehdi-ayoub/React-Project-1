import React from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

const Map = () => {
  // Replace with your Mapbox access token
  const accessToken = 'pk.eyJ1IjoibWVoZGlheW91YiIsImEiOiJjbG02anZpMm40cnBoM2pwdmMwbWFsem44In0.PcPnwBmrJJd_sGhV8G8JVQ';

  // const mapStyle = 'mapbox://styles/mapbox/streets-v11'; // Replace with your desired map style
  // Coordinates for the map center
  const center = [33.868135888303286, 35.55256348184419]; // Replace with your desired coordinates

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactMapboxGl
        style={{ width: '100%', height: '100%' }}
        accessToken={accessToken}
        center={center}
        zoom={[12]} // Adjust the zoom level as needed
        containerStyle={{
          height: '100%',
          width: '100%',
        }}
      >
        <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
          <Feature coordinates={center} />
        </Layer>
      </ReactMapboxGl>
    </div>
  );
};

export default Map;
