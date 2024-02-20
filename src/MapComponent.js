import React, { useEffect, useState, useRef, useContext } from "react";
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";
import DataContext from "./DataContext";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';

const containerStyle = {
  height: "100vh"
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
  const [alertMessage, setAlertMessage] = useState(false);
  const [loadAlert, setLoadAlert] = useState(false);
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

  useEffect(() => {
    if (alertMessage) setLoadAlert(true);
    else setLoadAlert(false)
  }, [alertMessage]);

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

  const IOSSwitch = styled((props) => (
    <Switch 
      focusVisibleClassName=".Mui-focusVisible" disableRipple 
      onChange={(event) => {
        if (event.target.checked) {
          const chatSocket = new WebSocket('ws://localhost:8080');

          chatSocket.onopen = function() {
            console.log("websocket connected");
          };

          chatSocket.onmessage = function(e) {
              const message = JSON.parse(e.data);
              console.log("message : ", message);
              if (message === "SLEEPING" || message === "DROWSY") setAlertMessage(message)
              else setAlertMessage(false)
          };

          chatSocket.onclose = function(e) {
              console.error('Chat socket closed unexpectedly');
          };

        }
      }}
      {...props} />
    ))(({ theme }) => ({
      width: 42,
      height: 26,
      padding: 0,
      '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
          transform: 'translateX(16px)',
          color: '#fff',
          '& + .MuiSwitch-track': {
            backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
            opacity: 1,
            border: 0,
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.5,
          },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
          color: '#33cf4d',
          border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
          color:
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
      },
      '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
      },
      '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
          duration: 500,
        }),
      },
    }));

  const selectStyle = {
      boxShadow: 'none',
     '.MuiOutlinedInput-notchedOutline': { border: 0 },
      "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":{ border: 0 },
      "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { border: 0 }
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
      {loadAlert && <Alert variant="filled" severity="error">Wake up! You are {alertMessage}</Alert>}
      <div className="absolute z-50 flex flex-row flex-wrap justify-start">
        <div className="m-5 hidden md:block">
          <img 
              src='http://localhost:3000/drive_smart_logo.png'
              alt='Be Safe, Drive Smart'
              width={150}
              height={150}
          />
        </div>
        <div className="flex flex-col">
          <div className="mt-5 w-80">
            <FormControl className="w-11/12 bg-white rounded-full">
              <InputLabel id="start">Source</InputLabel>
              <Select label="Source" sx={selectStyle}>
                <MenuItem value={"chicago, il"}>{"Chicago"}</MenuItem>
                <MenuItem value={"st louis, mo"}>{"St Louis"}</MenuItem>
                <MenuItem value={"joplin, mo"}>{"Joplin, MO"}</MenuItem>
                <MenuItem value={"oklahoma city, ok"}>{"Oklahoma City"}</MenuItem>
                <MenuItem value={"amarillo, tx"}>{"Amarillo"}</MenuItem>
                <MenuItem value={"flagstaff, az"}>{"Flagstaff, AZ"}</MenuItem>
                <MenuItem value={"winona, az"}>{"Winona"}</MenuItem>
                <MenuItem value={"kingman, az"}>{"Kingman"}</MenuItem>
                <MenuItem value={"barstow, ca"}>{"Barstow"}</MenuItem>
                <MenuItem value={"san bernardino, ca"}>{"San Bernardino"}</MenuItem>
                <MenuItem value={"los angeles, ca"}>{"Los Angeles"}</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="mt-5 w-80">
            <FormControl className="w-11/12 bg-white rounded-full">
              <InputLabel id="end">Destination</InputLabel>
              <Select label="Destination" sx={selectStyle}>
                <MenuItem value={"chicago, il"}>{"Chicago"}</MenuItem>
                <MenuItem value={"st louis, mo"}>{"St Louis"}</MenuItem>
                <MenuItem value={"joplin, mo"}>{"Joplin, MO"}</MenuItem>
                <MenuItem value={"oklahoma city, ok"}>{"Oklahoma City"}</MenuItem>
                <MenuItem value={"amarillo, tx"}>{"Amarillo"}</MenuItem>
                <MenuItem value={"flagstaff, az"}>{"Flagstaff, AZ"}</MenuItem>
                <MenuItem value={"winona, az"}>{"Winona"}</MenuItem>
                <MenuItem value={"kingman, az"}>{"Kingman"}</MenuItem>
                <MenuItem value={"barstow, ca"}>{"Barstow"}</MenuItem>
                <MenuItem value={"san bernardino, ca"}>{"San Bernardino"}</MenuItem>
                <MenuItem value={"los angeles, ca"}>{"Los Angeles"}</MenuItem>
              </Select>
            </FormControl>
          </div> 
        </div>
        <div className="m-5 flex space-x-5 hidden md:block">
          <Fab variant="extended">
            <FormControlLabel control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}/>
            Drowsy Alert
          </Fab>
          <Link to="/heatMap"><Fab variant="extended"><NavigationIcon sx={{ mr: 1 }} />Heat Map</Fab></Link>
        </div>
        <div className="m-5 flex min-[330px]:space-x-5 max-[330px]:space-y-5 flex-wrap block md:hidden">
          <Fab variant="extended" size="small">
            <FormControlLabel size="small" control={<IOSSwitch sx={{ ml: 1, mr: -1 }} defaultChecked={false}/>}
              />
            {<span style={{ fontSize: '15px', textWrap: "nowrap" }}>{"Drowsy Alert"}</span>}
          </Fab>
          <Link to="/heatMap"><Fab variant="extended" size="small"><NavigationIcon sx={{ mr: 1 }} />{<span style={{ fontSize: '15px', textWrap: "nowrap" }}>{"Heat Map"}</span>}</Fab></Link>
        </div>
      </div>
      <LoadScript googleMapsApiKey="AIzaSyBzTrQvxWyY_tVzTk-lgDbPwQcfOjYy2Yc">
      <div>
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
