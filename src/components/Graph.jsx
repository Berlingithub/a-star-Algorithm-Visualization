import './Graph.css';
import GraphCanvas from './GraphCanvas';
import {useEffect, useRef, useState} from 'react';


export default function()
{
    const ref = useRef();
    // console.log(ref);

    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const [displayText,setDisplayText]=useState("");

    useEffect(() => {
        if(ref.current)
        {setWidth(ref.current.clientWidth);
        setHeight(ref.current.clientHeight-50);}
    }, [ref.current]);

    return (
        <div ref={ref} className="graph">
            {((width==null)||(height==null))?"":
            <GraphCanvas width={width} height={height} setDisplayText={setDisplayText}/>}
            <div className="mincost">{displayText}</div>
        </div>
    )
}