import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, HeatmapLayer } from '@react-google-maps/api';
import alt_s3 from './alt_s3.json'; 

const libraries = ["visualization"];

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

export default function HeatMap() {

    const [gMap, setGMap] = useState(null);
    const coordsRef = useRef([]);
 
    useEffect(() => {
      if(gMap) {
        getAllCoords();
      }
    }, [gMap]);

    const getAllCoords = () => {
      let coords = [];
      for (const record of alt_s3) {
        coords.push(new window.google.maps.LatLng(record.LATITUDE, record.LONGITUD));
      }
      coordsRef.current = coords.splice(0,80000);
    }

    const onLoad = (map) => {
        setGMap(map);
    }

  return (
    <>
      <div>Heat Map</div>
    <LoadScript googleMapsApiKey="AIzaSyDpjafvu3nSe9ShPUp-hcksde4cRRTv8Ow" libraries={libraries}>
    <GoogleMap
      id="heatmap"
      mapContainerStyle={mapContainerStyle}
      zoom={4}
      center={center}
      onLoad={onLoad}
    >
        {coordsRef.current.length > 0 && <HeatmapLayer data={coordsRef.current} />} 
    </GoogleMap>
    </LoadScript>
    </>
  );
}
