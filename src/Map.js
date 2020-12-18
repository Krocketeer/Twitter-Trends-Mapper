import React, {useEffect, useState} from 'react'
import {GoogleMap, InfoWindow, LoadScript, Marker} from '@react-google-maps/api';

const containerStyle = {
    width: '75vw',
    height: '100vh'
};

const onLoadMarker = marker => {
  console.log('marker: ', marker)
}

const onLoadInfoWindow = infoWindow => {
    console.log("infoWindow: ", infoWindow)
}

function Map(props) {
    const coordinates = props.coordinates
    const [center_lat, center_long] = props.center
    const [selectedMarker, setSelectedMarker] = useState(null)
    const [location, setLocation] = useState(null)

    useEffect(() => {
        const listener = e => {
            if (e.key === "Escape") {
                setSelectedMarker(null)
                setLocation(null)
            }
        }
        window.addEventListener("keydown", listener)
        return() => {
            window.removeEventListener("keydown", listener)
        }
    }, [])

    return <div className="map">
        <LoadScript googleMapsApiKey="Google Maps API Key goes here">
            <GoogleMap mapContainerStyle={containerStyle} center={{lat: center_lat, lng: center_long}} zoom={5}>
                {coordinates.map((coord, index) => {
                    let [lat, long] = coord
                    return <Marker key={index} onLoad={onLoadMarker} position={{lat: lat, lng: long}}
                                   onClick={() => {
                                       setSelectedMarker(coord)
                                       fetch("/get_location/" + lat + "," + long).then(response => response.json()).then(data => {
                                           console.log(lat + "," + long)
                                           setLocation(data)
                                       })
                                   }}>
                        {selectedMarker && selectedMarker === coord && (
                            <InfoWindow
                                onCloseClick={() => {
                                    setSelectedMarker(null)
                                    setLocation(null)
                                }}
                                position={{lat: selectedMarker.lat, lng: selectedMarker.long}}
                                key={index}
                                onLoad={onLoadInfoWindow}>
                                <div>
                                    <div>{location}</div>
                                    <div>{lat}, {long}</div>
                                </div>
                            </InfoWindow>
                        )}
                    </Marker>
                })}
            </GoogleMap>
        </LoadScript>
    </div>
}

export default Map