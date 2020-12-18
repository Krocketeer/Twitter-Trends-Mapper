import React, {useEffect, useState} from "react"
import './App.css';
import Map from "./Map"
import Trends from "./Trends"
import ClickableMap from "./ClickableMap";
import Footer from "./Footer"

function App() {
    const [data, setData] = useState("")
    const [trends, setTrends] = useState("")
    const [choice, setChoice] = useState(true) /*choice default "true" means see US trends*/

    useEffect(() => {
        fetch("/data").then(response => response.json()).then(data => {
            setData(data);
        })
        fetch("/ustrends").then(response => response.json()).then(trends => {
            setTrends(trends)
        })
    }, []);

    return <div className="App">
        <div className="layout">
            <div className="messages">
                <h2>Twitter Trends Mapper</h2>
                {choice ? <>
                    <button className="button" style={{background: "rgb(192, 203, 231)", color: "black"}}
                            onClick={() => {
                                console.log("Trends in the US")
                                setChoice(true)
                                fetch("/ustrends").then(response => response.json()).then(trends => {
                                    setTrends(trends)
                                })
                            }}>Trends in the US
                    </button>
                    <button className="button"
                            onClick={() => {
                                console.log("Trends By City")
                                setChoice(false)
                            }}>Trends by City
                    </button>
                    <p>Click a marker to see more information about the city.</p>
                </> : <>
                    <button className="button"
                            onClick={() => {
                                console.log("Trends in the US")
                                setChoice(true)
                                fetch("/ustrends").then(response => response.json()).then(trends => {
                                    setTrends(trends)
                                })
                            }}>Trends in the US
                    </button>
                    <button className="button" style={{background: "rgb(192, 203, 231)", color: "black"}}
                            onClick={() => {
                                console.log("Trends By City")
                                setChoice(false)
                            }}>Trends by City
                    </button>
                    <p>Click a city on the map to see its top trends. Press "escape" to remove marker.</p>
                </>
                }
                {trends ?
                    <Trends trends={trends} toggleChoice={choice} saveData={(data)=>{setData(data)}}/>
                    :
                    <span>Loading trends...</span>
                }
            </div>
            {data ?
                choice ?
                    <Map center={data.center_coord} coordinates={data.coord_list}/> :
                    <ClickableMap center={data.center_coord} saveTrends={(trends)=>{setTrends(trends)}}/>
                    :
                <span style={styles.loadingMap}>Loading Map...</span>
            }
        </div>
        <Footer />
    </div>
}

export default App;

const styles = {
    loadingMap: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "32px"
    }
}
