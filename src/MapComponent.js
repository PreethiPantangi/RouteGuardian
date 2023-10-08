import React, { useEffect, useState, useRef, useContext } from "react";
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";
import DataContext from "./DataContext";

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
  const data = useContext(DataContext);
  const mapData = data.mapData;
  
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
    setCalculatingCrashes(true);
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
          const lat = parseFloat(latitude).toFixed(2);
          const lng = parseFloat(longitude).toFixed(2)
          return mapData.get(lat + '_' + lng);
        };

        const findWarningColors = (warning, medianRecords) => {
          if (warning.length > medianRecords) return "red";
          else if ((warning.length = medianRecords)) return "orange";
          else return "yellow";
        };

        let routesData = routes;
        routesData.forEach((route) => {
          let crashWarningsData = [];
          let maxRecords = -1;
          let coords = route.overview_path;
          coords.forEach((coord) => {
            let coordInfo = searchByCoordinates(coord.lat(), coord.lng());
            debugger;
            if (coordInfo) {
              if (coordInfo.count > maxRecords) {
                maxRecords = coordInfo.count;
              }
              debugger;
              (coordInfo.coords).forEach((coord) => {
                debugger;
                crashWarningsData.push(new window.google.maps.LatLng(coord.lat,coord.lng));
              })
            }
          });
          const medianRecords = maxRecords / 2;

          let data = [];

          // debugger;
          crashWarningsData.forEach((warning) => {
            const warningCircle = new window.google.maps.Circle({
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: findWarningColors(warning, medianRecords),
              fillOpacity: 0.35,
              map: getMap(),
              center: warning,
              radius: Math.sqrt(2000) * 100,
            });
            data.push(warningCircle);
          });
          crashWarningsRef.current.push(...data);
        });
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
        {calculatingCrashes && console.log("loading")}
          {calculatingCrashes && (
            <div class="flex justify-center items-center">
              <div className="mb-20 absolute inset-0 flex justify-center items-center">
                <div className="animate-spin h-8 w-8 border-t-2 border-black border-r-2 rounded-full"></div>
              </div>
              <div className="z-10 font-bold text-2xl bg-white opacity-75 absolute inset-0 flex justify-center items-center">
                Loading all possible routes...
              </div>
            </div>
           )}
      </LoadScript>
    </div>
  );
};

export default MapComponent;
