import React, { useEffect, useState } from 'react';
import { GoogleMap, HeatmapLayer, LoadScript } from '@react-google-maps/api';
import alt_s3 from './alt_s3.json'; 

const containerStyle = {
  height: "600px",
};

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

export default function HeatMap() {

    const [gMap, setGMap] = useState(null);
    const [coordsData, setCoordsDdata] = useState(null);
 
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
      setCoordsDdata(coords.splice(0,80000));
    }

    const onLoad = (map) => {
        setGMap(map);
    }

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyDpjafvu3nSe9ShPUp-hcksde4cRRTv8Ow" libraries={["visualization"]}>
      <div className="border border-black m-3 p-2">
        <GoogleMap
        id="heatmap"
        mapContainerStyle={containerStyle}
        zoom={4}
        center={center}
        onLoad={onLoad}
      >
          {coordsData && coordsData.length > 0 ? <HeatmapLayer data={coordsData}/> : <div>Loading.......</div>} 
      </GoogleMap>
      </div>
    </LoadScript>
    </>
  );
}
