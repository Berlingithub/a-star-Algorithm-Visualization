import './Graph.css';
import GraphCanvas from './GraphCanvas';
import {useEffect, useRef, useState} from 'react';


export default function()
{
    const ref = useRef();
    // console.log(ref);

    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);

    useEffect(() => {
        if(ref.current)
        {setWidth(ref.current.clientWidth);
        setHeight(ref.current.clientHeight);}
    }, [ref.current]);

    return (
        <div ref={ref} className="graph">
            {((width==null)||(height==null))?"":
            <GraphCanvas width={width} height={height}/>}
        </div>
    )
}