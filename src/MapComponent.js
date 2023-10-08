// import React, { useEffect, useState, useRef } from 'react';
// import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';


// const containerStyle = {
//   height: '600px'
// };

// const floatingPanel  = {
//   top: '10px',
//   left: '25%',
//   zIndex: '5',
//   'backgroundColor': '#fff',
//   'padding': '5px',
//   'border': '1px solid #999',
//   'textAlign': 'center',
//   'lineHeight': '30px',
//   'paddingLeft': '10px'
// }

// const center = { lat: 41.85, lng: -87.65 };

// const MapComponent = () => {

//   const carshWarningsRef = useRef([]);
//   // const multipleRoutes = useRef([]);
//   const [gMap, setGMap] = useState();
//   const directionsServiceRef = useRef(null);
//   const directionsRendererRef = useRef(null);
//   const [multipleRoutes, setMultipleRoutes] = useState([]);


//   useEffect(() => {
//     if(gMap) {

//       const startElement = document.getElementById("start");
//       const endElement = document.getElementById("end");
  
//       if (startElement && endElement) {
//         startElement.addEventListener("change", () => {
//           onChangeHandler(gMap);
//         });
//         endElement.addEventListener("change", () => {
//           onChangeHandler(gMap);
//         });
//       }

//       directionsServiceRef.current = new window.google.maps.DirectionsService();
//       directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
//       loadMaps();
  
//       return () => {
//         if (startElement && endElement) {
//           startElement.removeEventListener("change", onChangeHandler);
//           endElement.removeEventListener("change", onChangeHandler);
//         }
//       };
//     }
//   }, [gMap]);
    

//     const calculateAndDisplayRoute = (getMap) => {

//       if (!directionsServiceRef.current || !directionsRendererRef.current) return;

//       directionsServiceRef.current.route({
//         origin: {
//           query: document.getElementById("start").value,
//         },
//         destination: {
//           query: document.getElementById("end").value,
//         },
//         travelMode: window.google.maps.TravelMode.DRIVING,
//         provideRouteAlternatives: true,
//       })
//       .then((result) => {

//         console.log(result);
//         directionsRendererRef.current.setDirections(result);
//         directionsRendererRef.current.setOptions({
//           polylineOptions: {
//             strokeColor: '#65ace6'
//           }
//         });
//         let routes = [];
//         if(result.routes[1]) {
//           routes.push(result.routes[1])
//         } else if (result.routes[2]) {
//           routes.push(result.routes[2]);
//         }
//         console.log(routes);
//         let _routes = [];

//         let routesData = result.routes[0].overview_path;

//         let shuffled = routesData, i = routesData.length, min = i - 15, temp, index;
//         while (i-- > min) {
//           index = Math.floor((i + 1) * Math.random());
//           temp = shuffled[index];
//           shuffled[index] = shuffled[i];
//           shuffled[i] = temp;
//         }

//         let latlng = [];

//         (shuffled.slice(min)).forEach((coord) => {
//           latlng.push({lat: coord.lat(), lng: coord.lng()});
//         });
//         console.log(latlng);
        
//       let data = [];

//       routes.forEach((route) => {
        
//         _routes.push(route.overview_path);

//         let coords = route.overview_path[99];
//         let coords1 = route.overview_path[60];
//         let coords2 = route.overview_path[30];

//         let carshWarningsData = [
//           { coords: {lat: coords.lat(), lng: coords.lng()}, severity: 'red' },
//           { coords: {lat: coords1.lat(), lng: coords1.lng()}, severity: 'orange' },
//           { coords: {lat: coords2.lat(), lng: coords2.lng()}, severity: 'yellow' },
//         ]

//         carshWarningsData.forEach((warning) => {
//           const warningCircle = new window.google.maps.Circle({
//             strokeColor: "#FF0000",
//             strokeOpacity: 0.8,
//             strokeWeight: 2,
//             fillColor: warning.severity,
//             fillOpacity: 0.35,
//             map: getMap(),
//             center: warning.coords,
//             radius: Math.sqrt(20000) * 100,
//           });
//           data.push(warningCircle);
//         });
//         carshWarningsRef.current = data;

//       })
//       setMultipleRoutes(_routes);
//       })
//       .catch((e) => window.alert("Directions request failed due to " + e));
//     };

//     const onChangeHandler = (gMap) => {
//       if(document.getElementById('start').value === document.getElementById('end').value) {
//         alert("Please make sure source and destination are different!");
//         return;
//       }

//       carshWarningsRef.current.forEach((circle) => {
//         circle && circle.setMap && circle.setMap(null);
//       });
//       carshWarningsRef.current = [];
//       calculateAndDisplayRoute(() => gMap);
//     };
  
//     const loadMaps = () => {
//       if (gMap && directionsRendererRef.current) {
//         directionsRendererRef.current.setMap(gMap);
//       }
//     };

//     const onLoad = (map) => {
//       setGMap(map);
//     };

//   return (
    
//     <div>
//       <div style={floatingPanel}>
//       <b>Start: </b>
//       <select id="start">
//         <option value="chicago, il">Chicago</option>
//         <option value="st louis, mo">St Louis</option>
//         <option value="joplin, mo">Joplin, MO</option>
//         <option value="oklahoma city, ok">Oklahoma City</option>
//         <option value="amarillo, tx">Amarillo</option>
//         <option value="gallup, nm">Gallup, NM</option>
//         <option value="flagstaff, az">Flagstaff, AZ</option>
//         <option value="winona, az">Winona</option>
//         <option value="kingman, az">Kingman</option>
//         <option value="barstow, ca">Barstow</option>
//         <option value="san bernardino, ca">San Bernardino</option>
//         <option value="los angeles, ca">Los Angeles</option>
//       </select>
//       <b>End: </b>
//       <select id="end">
//         <option value="chicago, il">Chicago</option>
//         <option value="fairfax, va">Fairfax</option>
//         <option value="st louis, mo">St Louis</option>
//         <option value="joplin, mo">Joplin, MO</option>
//         <option value="oklahoma city, ok">Oklahoma City</option>
//         <option value="amarillo, tx">Amarillo</option>
//         <option value="gallup, nm">Gallup, NM</option>
//         <option value="flagstaff, az">Flagstaff, AZ</option>
//         <option value="winona, az">Winona</option>
//         <option value="kingman, az">Kingman</option>
//         <option value="barstow, ca">Barstow</option>
//         <option value="san bernardino, ca">San Bernardino</option>
//         <option value="los angeles, ca">Los Angeles</option>
//       </select>
//     </div>
//     {/*  "AIzaSyDpjafvu3nSe9ShPUp-hcksde4cRRTv8Ow" OUR API KEY */}
//     <LoadScript googleMapsApiKey="AIzaSyDpjafvu3nSe9ShPUp-hcksde4cRRTv8Ow">
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={center}
//           zoom={7}
//           onLoad={onLoad}
//           id="map"
//         >
//           {multipleRoutes?.length > 0 && multipleRoutes.map((route, index) => (
//   <Polyline 
//     key={index} 
//     path={route.map(coord => { return {lat: coord.lat(), lng: coord.lng()} })} 
//     options={{ strokeColor: '#65ace6' }} 
//   />
// ))}

//           { /* Child components, markers, etc. */}
//         </GoogleMap>
//       </LoadScript>
//     </div>
//   );
// };

// export default MapComponent;

import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import alt_s3 from './alt_s3.json'; 


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
  // const multipleRoutes = useRef([]);
  const [gMap, setGMap] = useState();
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const [multipleRoutes, setMultipleRoutes] = useState([]);


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
        provideRouteAlternatives: true,
      })
      .then((result) => {

        directionsRendererRef.current.setDirections(result);
        directionsRendererRef.current.setOptions({
          polylineOptions: {
            strokeColor: '#65ace6'
          }
        });
        let routes = [result.routes[1], result.routes[2]];
        let _routes = [];

        let routesData = result.routes[0].overview_path;

        let shuffled = routesData, i = routesData.length, min = i - 15, temp, index;
        while (i-- > min) {
          index = Math.floor((i + 1) * Math.random());
          temp = shuffled[index];
          shuffled[index] = shuffled[i];
          shuffled[i] = temp;
        }

        let latlng = [];

        (shuffled.slice(min)).forEach((coord) => {
          latlng.push({lat: coord.lat(), lng: coord.lng()});
        });
        
        // Function to search for a specific latitude and longitude
        function searchByCoordinates(latitude, longitude) {

          let results = [];
          for (const record of alt_s3) {
            const recordLat = parseFloat(record.LATITUDE);
            const recordLng = parseFloat(record.LONGITUD);

            if (
              !isNaN(recordLat) &&
              !isNaN(recordLng) &&
              parseFloat(record.LATITUDE).toFixed(3) === parseInt(latitude).toFixed(3) &&
              parseInt(record.LONGITUD).toFixed(3) === parseInt(longitude).toFixed(3)
            ) {
              results.push(record)
            }
          }

          return ({coords: {lat: latitude, lng: longitude}, length: results.length});
        }

        const carshWarningsData = []
        latlng.forEach((ll) => {
          if (searchByCoordinates(ll.lat, ll.lng).length>0) carshWarningsData.push(searchByCoordinates(ll.lat, ll.lng))
        });
        const maxRecords = Math.max(...carshWarningsData.map((matchingRecord) => matchingRecord.length));
        const medianRecords = maxRecords/2;
        console.log("carshWarningsData FINAL : ", carshWarningsData)
        console.log("maxLenRecords : ", maxRecords)
        
        
      let data = [];

      routes.forEach((route) => {
        
        _routes.push(route.overview_path);

        const findWarningColors = (warning) => {
          if (warning.length > medianRecords) return "red"
          else if (warning.length = medianRecords) return "orange"
          else return "yellow"
        }

        carshWarningsData.forEach((warning) => {
          const warningCircle = new window.google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: findWarningColors(warning),
            fillOpacity: 0.35,
            map: getMap(),
            center: warning.coords,
            radius: Math.sqrt(20000) * 100,
          });
          data.push(warningCircle);
        });
        carshWarningsRef.current = data;

      })
      setMultipleRoutes(_routes);
      })
      .catch((e) => window.alert("Directions request failed due to " + e));
    };

    const onChangeHandler = (gMap) => {
      if(document.getElementById('start').value === document.getElementById('end').value) {
        alert("Please make sure source and destination are different!");
        return;
      }

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
          {multipleRoutes?.length > 0 && multipleRoutes.map((route, index) => (
  <Polyline 
    key={index} 
    path={route.map(coord => { return {lat: coord.lat(), lng: coord.lng()} })} 
    options={{ strokeColor: '#65ace6' }} 
  />
))}

          { /* Child components, markers, etc. */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
