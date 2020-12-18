import React, {useEffect, useState} from 'react'
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';

const containerStyle = {
    width: '75vw',
    height: '100vh'
};

const onLoadMarker = marker => {
  console.log('marker: ', marker)
}

function ClickableMap(props) {
    const [center_lat, center_long] = props.center
    const [center, setCenter] = useState({lat: center_lat, lng: center_long})
    const [markerCoords, setMarkerCoords] = useState(null)
    const [zoom, setZoom] = useState(5)

    useEffect(() => {
        const listener = e => {
            if (e.key === "Escape") {
                setMarkerCoords(null)
                setCenter({lat: center_lat, lng: center_long})
                setZoom(5)
            }
        }
        window.addEventListener("keydown", listener)
        return() => {
            window.removeEventListener("keydown", listener)
        }
    })
    
    return <div className="map">
        <LoadScript googleMapsApiKey="Google Maps API Key goes here">
            <GoogleMap mapContainerStyle={containerStyle} center={center}
                zoom={zoom} onClick={e => {
                    const lat = e.latLng.lat()
                    const long = e.latLng.lng()
                    console.log("Coordinates: (" + lat + ", " + long + ")")
                    setMarkerCoords({lat: lat, lng: long})
                    setCenter({lat: lat, lng: long})
                    setZoom(6)
                    fetch('/trends/' + lat + "," + long).then(response => response.json()).then(trends => {
                        props.saveTrends(trends)
                    })
                }}>
                {markerCoords ?
                    <Marker position={markerCoords} onLoad={onLoadMarker} /> : null
                }
            </GoogleMap>
        </LoadScript>
    </div>
}

export default ClickableMap