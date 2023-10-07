import React, { useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';


const containerStyle = {
  height: '600px'
};

const floatingPanel  = {
  top: '10px',
  left: '25%',
  zIndex: '5',
  'backgroundColor': '#fff',
  'padding': '5px',
  'border': '1px solid #999',
  'textAlign': 'center',
  'lineHeight': '30px',
  'paddingLeft': '10px'
}

const center = { lat: 41.85, lng: -87.65 };

const MapComponent = () => {

  const [carshWarnings, setCrashWarnings] = useState([]);

  const onLoad = (map) => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);

    const onChangeHandler = () => {
      carshWarnings.forEach((circle) => {
        circle.setMap(null);
      });
      calculateAndDisplayRoute(directionsService, directionsRenderer);
    };

    document.getElementById("start").addEventListener("change", onChangeHandler);
    document.getElementById("end").addEventListener("change", onChangeHandler);

    const calculateAndDisplayRoute = (directionsService, directionsRenderer) => {
      // console.log(carshWarnings);
      directionsService.route({
        origin: {
          query: document.getElementById("start").value,
        },
        destination: {
          query: document.getElementById("end").value,
        },
        travelMode: window.google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        console.log(response);
        directionsRenderer.setDirections(response);
        let coords = response.routes[0].overview_path[99];
        let coords1 = response.routes[0].overview_path[60];
        let coords2 = response.routes[0].overview_path[30];

        let carshWarningsData = [
          { coords: {lat: coords.lat(), lng: coords.lng()}, severity: 'red' },
          { coords: {lat: coords1.lat(), lng: coords1.lng()}, severity: 'orange' },
          { coords: {lat: coords2.lat(), lng: coords2.lng()}, severity: 'yellow' },
        ]

        let data = []
        carshWarningsData.forEach((warning) => {
          const warningCircle = new window.google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: warning.severity,
            fillOpacity: 0.35,
            map: map,
            center: warning.coords,
            radius: Math.sqrt(20000) * 100,
          });
          data.push(warningCircle);
        });
        // console.log(data);
        setCrashWarnings(data);
      })
      .catch((e) => window.alert("Directions request failed due to " + e));
    };
  };

  return (
    
    <div>
      <div style={floatingPanel}>
      <b>Start: </b>
      <select id="start">
        <option value="chicago, il">Chicago</option>
        <option value="st louis, mo">St Louis</option>
        <option value="joplin, mo">Joplin, MO</option>
        <option value="oklahoma city, ok">Oklahoma City</option>
        <option value="amarillo, tx">Amarillo</option>
        <option value="gallup, nm">Gallup, NM</option>
        <option value="flagstaff, az">Flagstaff, AZ</option>
        <option value="winona, az">Winona</option>
        <option value="kingman, az">Kingman</option>
        <option value="barstow, ca">Barstow</option>
        <option value="san bernardino, ca">San Bernardino</option>
        <option value="los angeles, ca">Los Angeles</option>
      </select>
      <b>End: </b>
      <select id="end">
        <option value="chicago, il">Chicago</option>
        <option value="fairfax, va">Fairfax</option>
        <option value="st louis, mo">St Louis</option>
        <option value="joplin, mo">Joplin, MO</option>
        <option value="oklahoma city, ok">Oklahoma City</option>
        <option value="amarillo, tx">Amarillo</option>
        <option value="gallup, nm">Gallup, NM</option>
        <option value="flagstaff, az">Flagstaff, AZ</option>
        <option value="winona, az">Winona</option>
        <option value="kingman, az">Kingman</option>
        <option value="barstow, ca">Barstow</option>
        <option value="san bernardino, ca">San Bernardino</option>
        <option value="los angeles, ca">Los Angeles</option>
      </select>
    </div>
    {/*  "AIzaSyDpjafvu3nSe9ShPUp-hcksde4cRRTv8Ow" OUR API KEY */}
    <LoadScript googleMapsApiKey="AIzaSyDpjafvu3nSe9ShPUp-hcksde4cRRTv8Ow">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          onLoad={onLoad}
          id="map"
        >
          { /* Child components, markers, etc. */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
