import React, { useEffect, useState, useRef } from 'react';
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

  const carshWarningsRef = useRef([]);
  const [gMap, setGMap] = useState();
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);

  useEffect(() => {
    if(gMap) {

      const startElement = document.getElementById("start");
      const endElement = document.getElementById("end");
  
      if (startElement && endElement) {
        startElement.addEventListener("change", () => {
          onChangeHandler(gMap);
        });
        endElement.addEventListener("change", () => {
          onChangeHandler(gMap);
        });
      }

      directionsServiceRef.current = new window.google.maps.DirectionsService();
    directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
    loadMaps();
  
      return () => {
        if (startElement && endElement) {
          startElement.removeEventListener("change", onChangeHandler);
          endElement.removeEventListener("change", onChangeHandler);
        }
      };

      
    }
  }, [gMap]);
    

    const calculateAndDisplayRoute = (getMap) => {

      if (!directionsServiceRef.current || !directionsRendererRef.current) return;

      directionsServiceRef.current.route({
        origin: {
          query: document.getElementById("start").value,
        },
        destination: {
          query: document.getElementById("end").value,
        },
        travelMode: window.google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRendererRef.current.setDirections(response);
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
            map: getMap(),
            center: warning.coords,
            radius: Math.sqrt(20000) * 100,
          });
          data.push(warningCircle);
        });
        carshWarningsRef.current = data;
      })
      .catch((e) => window.alert("Directions request failed due to " + e));
    };

    const onChangeHandler = (gMap) => {
      console.log(carshWarningsRef.current);
      debugger;
      carshWarningsRef.current.forEach((circle) => {
        circle && circle.setMap && circle.setMap(null);
      });
      carshWarningsRef.current = [];
      calculateAndDisplayRoute(() => gMap);
    };
  
    const loadMaps = () => {
      if (gMap && directionsRendererRef.current) {
        directionsRendererRef.current.setMap(gMap);
      }
    };

    
    const onLoad = (map) => {
      setGMap(map);
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