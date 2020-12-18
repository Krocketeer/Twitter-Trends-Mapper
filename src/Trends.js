import React from "react"
import Card from '@material-ui/core/Card';
import OverflowScrolling from 'react-overflow-scrolling';
import './App.css';

function Trends(props) {
    const choice = props.toggleChoice
    const arr = []
    Object.keys(props.trends).forEach(key => arr.push({name: key, value: props.trends[key]}))
    arr.sort((a,b) => b.value - a.value)

    return <div className="trends">
        {(choice &&
            <OverflowScrolling className='overflow-scrolling'>
                <div style={{height : '70vh'}}>
                    {arr.map((m, i) => {
                        return <Card className="card" variant="outlined" key={i}>
                            <p className="trend"><b>{m.name}</b><br/># of Tweets: {m.value}</p>
                        </Card>
                    })}
                </div>
            </OverflowScrolling>
        ) ||
            <OverflowScrolling className='overflow-scrolling'>
                <div style={{height : '70vh'}}>
                    {arr.map((m,i)=> {
                        return  <Card className='card' variant="outlined" key={i}>
                            <p className="trend"><b>{m.name}</b><br/># of Tweets: {m.value}</p>
                        </Card>
                    })}
                </div>
            </OverflowScrolling>
        }
    </div>
}

export default Trends