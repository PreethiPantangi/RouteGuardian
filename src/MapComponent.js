import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";
import alt_s3 from "./alt_s3.json";

const containerStyle = {
  height: "510px",
};

const center = { lat: 41.85, lng: -87.65 };

const MapComponent = () => {
  const crashWarningsRef = useRef([]);
  // const multipleRoutes = useRef([]);
  const [gMap, setGMap] = useState();
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const [multipleRoutes, setMultipleRoutes] = useState([]);
  const [calculatingCrashes, setCalculatingCrashes] = useState(false);

  useEffect(() => {
    if (gMap) {
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
      directionsRendererRef.current =
        new window.google.maps.DirectionsRenderer();
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

    directionsServiceRef.current
      .route({
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
            strokeColor: "#65ace6",
          },
        });

        let routes = result.routes;
        let overviewPaths = [];
        for (let i = 0; i < routes.length; i++) {
          overviewPaths.push(routes[i].overview_path);
        }
        setMultipleRoutes(overviewPaths);

        const searchByCoordinates = (latitude, longitude) => {
          let results = [];
          for (const record of alt_s3) {
            const recordLat = parseFloat(record.LATITUDE);
            const recordLng = parseFloat(record.LONGITUD);
            if (
              !isNaN(recordLat) &&
              !isNaN(recordLng) &&
              parseFloat(record.LATITUDE).toFixed(3) ===
                parseInt(latitude).toFixed(3) &&
              parseInt(record.LONGITUD).toFixed(3) ===
                parseInt(longitude).toFixed(3)
            ) {
              results.push(record);
            }
          }
          return results.length > 0
            ? {
                coords: { lat: latitude, lng: longitude },
                length: results.length,
              }
            : undefined;
        };

        const findWarningColors = (warning, medianRecords) => {
          if (warning.length > medianRecords) return "red";
          else if ((warning.length = medianRecords)) return "orange";
          else return "yellow";
        };

        let routesData = routes;
        console.log("Start - ", new Date());
        setCalculatingCrashes(true);
        routesData.forEach((route) => {
          let crashWarningsData = [];
          let maxRecords = -1;
          let coords = route.overview_path;
          coords.forEach((coord) => {
            let coordInfo = searchByCoordinates(coord.lat(), coord.lng());
            if (coordInfo) {
              if (coordInfo.length > maxRecords) {
                maxRecords = coordInfo.length;
              }
              crashWarningsData.push(coordInfo);
            }
          });
          const medianRecords = maxRecords / 2;

          let data = [];

          crashWarningsData.forEach((warning) => {
            const warningCircle = new window.google.maps.Circle({
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: findWarningColors(warning, medianRecords),
              fillOpacity: 0.35,
              map: getMap(),
              center: warning.coords,
              radius: Math.sqrt(2000) * 100,
            });
            data.push(warningCircle);
          });
          crashWarningsRef.current.push(...data);
        });
        console.log("Finish - ", new Date());
        setCalculatingCrashes(false);
      })
      .catch((e) => window.alert("Directions request failed due to " + e));
  };

  const onChangeHandler = (gMap) => {
    if (
      document.getElementById("start").value ===
      document.getElementById("end").value
    ) {
      alert("Please make sure source and destination are different!");
      return;
    }
    crashWarningsRef.current.forEach((circle) => {
      debugger;
      circle && circle.setMap && circle.setMap(null);
    });
    crashWarningsRef.current = [];
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
      <div className="flex space-x-52 m-5">
        <div className="flex space-x-5">
          <div className="mt-1 font-semibold">Source</div>
          <div className="border border-slate-400 p-1 rounded-sm">
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
          </div>
        </div>
        <div className="flex space-x-5">
          <div className="mt-1 font-semibold">Destination</div>
          <div className="border border-slate-400 p-1 rounded-sm">
            <select id="end">
              <option value="Select deatination">Select destination</option>
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
        </div>
      </div>
      <LoadScript googleMapsApiKey="AIzaSyDpjafvu3nSe9ShPUp-hcksde4cRRTv8Ow">
        <div className="border border-black m-3 p-2">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          onLoad={onLoad}
          id="map"
        >
          {multipleRoutes?.length > 0 &&
            multipleRoutes.map((route, index) => (
              <Polyline
                key={index}
                path={route.map((coord) => {
                  return { lat: coord.lat(), lng: coord.lng() };
                })}
                options={{ strokeColor: "#65ace6" }}
              />
            ))}

          {/* Child components, markers, etc. */}
          {calculatingCrashes && <div className="z-10 font-bold text-2xl">Loading all possible routes</div>}
        </GoogleMap>
        </div>  
      </LoadScript>
    </div>
  );
};

export default MapComponent;
