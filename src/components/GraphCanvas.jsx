import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Star, Text, Rect,Circle,Line } from 'react-konva';
import PriorityQueue from 'js-priority-queue';

function distedge(point1,point2)
{
    
    let x_dist=Math.abs(point1.x-point2.x);
    let y_dist=Math.abs(point1.y-point2.y);
    
    return Math.sqrt(x_dist*x_dist+y_dist*y_dist);
}
function connectedgraph(points,edges,setPoints,setEdges,pointvisitcolor,pointqueuecolor,edgetraversecolor,finalpathcolor,setDisplayText,display=false,startindex=0,endindex=1)
{
    let functionlist=[];
    if((points.length==0)||(edges.length==0))
    {
        return false;
    }
    let graph=Array(points.length);
    
    for( let i=0;i<points.length;i+=1)
    {
        graph[i]=[];
    }
    
    edges.forEach(edge=>{
        graph[edge.start].push(edge.end);
        graph[edge.end].push(edge.start);
    });

    let actualcost=Array(points.length);
    let estimatedcost=Array(points.length);

    for(let i=0;i<points.length;++i)
    {
        actualcost[i]=Infinity;
    }

    for(let i=0;i<points.length;++i)
    {
        
        estimatedcost[i]=distedge(points[i],points[endindex]);
    }

    actualcost[startindex]=0;
    function comparator(a,b)
    {
        // console.log(a,b);
        // console.log("returning:",(a[0]<b[0])?"true":"false");
        return a[0]-b[0];
    }
    let queue = new PriorityQueue({comparator:comparator});
    
    // console.log(actualcost,estimatedcost);
    queue.queue([actualcost[startindex]+estimatedcost[startindex],startindex]);
    let parent={};
    while(queue.length>0)
    {
        // console.log(parent);
        let [cost,node]=queue.dequeue();
        
        if(display)
        {
            functionlist.push(()=>setPoints((prevPoints)=>{
                setDisplayText("Minimum Estimated cost:"+(Math.round(cost*100)/100));
                let newpoints=[...prevPoints];
                newpoints[node].color=pointvisitcolor;
                return newpoints;
            }))
        }
        
        
        
        let neighbours=graph[node];
        for(let i=0;i<neighbours.length;++i)
        {
            
            let newcost=(cost+distedge(points[node],points[neighbours[i]]));
            
            
            if(newcost<actualcost[neighbours[i]])
            {
                parent[neighbours[i]]=node;
                actualcost[neighbours[i]]=newcost;
                if(display)
                {
                    functionlist.push(()=>setEdges((prevEdges)=>{
                        let newedges=[...prevEdges];
                        for(let j=0;j<newedges.length;++j)
                        {
                            // console.log(newedges[i].start,newedges[i].end,node,neighbours[i]);
                            if(((newedges[j].start===node)&&(newedges[j].end===neighbours[i]))||
                            ((newedges[j].end===node)&&(newedges[j].start===neighbours[i])))
                            {
                                newedges[j].strokecolor=edgetraversecolor;
                            }
                        }
                        return newedges;
                    }))
                }
                if(display)
                {
                    functionlist.push(()=>setPoints((prevPoints)=>{
                        let newpoints=[...prevPoints];
                        newpoints[neighbours[i]].color=pointqueuecolor;
                        return newpoints;
                    }))
                }
                queue.queue([newcost,neighbours[i]]);
            }

            if(neighbours[i]==endindex)
            {
                if(display)
                {
                    functionlist.push(()=>{
                        setDisplayText("Final minimum cost:"+Math.round(newcost*100)/100);
                    })
                    let iter=endindex;
                    while(true)
                    {
                        console.log(iter,parent[iter]);
                        let node1=iter,node2=parent[iter];
                        functionlist.push(()=>setEdges((prevEdges)=>{
                            let newedges=[...prevEdges];
                            console.log(node1,node2);
                            for(let j=0;j<newedges.length;++j)
                            {
                                // console.log(newedges[i].start,newedges[i].end,node,neighbours[i]);
                                if(((newedges[j].start===node1)&&(newedges[j].end===node2))||
                                ((newedges[j].end===node1)&&(newedges[j].start===node2)))
                                {
                                    newedges[j].strokecolor=finalpathcolor;
                                    
                                }
                            }
                            return newedges;
                        }))
                        if(parent[iter]===startindex)
                        {
                            break;
                        }
                        iter=parent[iter];
                    }
                    return functionlist;
                }
                return true;
            }
        }
    }

    
    return false;
}
function intersects(a,b,c,d,p,q,r,s) {
    let det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
  };
function isIntersecting(points,edgs,edge)
{
    let found=false;
    edgs.forEach((edg)=>{
        if(intersects(points[edge.start].x,points[edge.start].y,points[edge.end].x,points[edge.end].y
            ,points[edg.start].x,points[edg.start].y,points[edg.end].x,points[edg.end].y))
            {
                found=true;
                return true;
            }
    })
    return found;
}
function calculatedgelength(points,edge)
{
    let xdist=Math.abs(points[edge.start].x-points[edge.end].x)
    let ydist=Math.abs(points[edge.start].y-points[edge.end].y)
    return Math.sqrt(xdist*xdist+ydist*ydist);
}
function calculatedges(numberOfEdges,points,numberOfPoints,setEdges,minedgelength,maxedgelength,strokecolor)
{
    let edgs=[];
    let failedtries=0;
    while(edgs.length<numberOfEdges)
    {
        let newEdge={
            start:(Math.floor(Math.random() * numberOfPoints)),
            end:(Math.floor(Math.random() * numberOfPoints)),
            strokecolor:strokecolor
        };
        let found=false;
        let {start:n_start,end:n_end}=newEdge;
        edgs.forEach(({start,end})=>
        {
            if(((n_start===start)&&(n_end===end))||((n_end===start)&&(n_start===end)))
            {
                found=true;
            }
        }
        )
        let edgelen=calculatedgelength(points,newEdge);
        if((!found)&&(n_start!=n_end)&&(!isIntersecting(points,edgs,newEdge))&&(edgelen<=maxedgelength)&&(edgelen>=minedgelength))
        {
            edgs.push(newEdge);
        }
        else
        {
            ++failedtries;
            if(failedtries>800)
            {
                return false;
            }
        }
    }
    
    setEdges(edgs);
    return true;
}
function calculatepoints(numberOfPoints,setPoints,width,height,radius,pointcolor)
{
    let pts=[{x:100,y:Math.floor(height/2)},{x:width-100,y:Math.floor(height/2)}];
    while(pts.length<numberOfPoints)
    {
        let newPoint={
            x:(Math.floor((Math.random() * (width-2*radius))/5)*5+radius),
            y:(Math.floor((Math.random() * (height-2*radius))/5)*5+radius),
            color:pointcolor
        };
        let found=false;
        let {x:n_x,y:n_y}=newPoint;
        pts.forEach(({x,y})=>
        {
            if((n_x===x)&&(n_y===y))
            {
                found=true;
            }
        }
        )
        if(!found)
        {
            
            pts.push(newPoint);
        }
    }
    setPoints(pts);
}

export default function({width,height,setDisplayText})
{
    let radius=12;
    let numberOfPoints=25;
    let numberOfEdges=40;
    let maxedgelength=Math.floor((3*(width+height))/(numberOfPoints));
    let minedgelength=maxedgelength/3;

    let pointcolor="#0B0644";
    let strokecolor="#D60040";

    let pointvisitcolor="#2583B8";
    let pointqueuecolor="#F3DB00";
    let edgetraversecolor="#0C4A16";
    let finalpathcolor="#c936c9";
   
    let [points,setPoints]=useState([]);
    let [edges,setEdges]=useState([]);
    let [finalGraphBuilt,setFinalGraphBuilt]=useState(false);
    useEffect(()=>{
        calculatepoints(numberOfPoints,setPoints,width,height,radius,pointcolor);
    },[]);
    useEffect(()=>{
        
        if((points.length===0)||(finalGraphBuilt))
        {
            return;
        }
        if(!calculatedges(numberOfEdges,points,numberOfPoints,setEdges,minedgelength,maxedgelength,strokecolor))
        {
            calculatepoints(numberOfPoints,setPoints,width,height,radius,pointcolor);
        }
        
    },[points])

    useEffect(()=>{
        if((edges.length==0)||(finalGraphBuilt))
        {
            return;
        }
        if(!connectedgraph(points,edges,setPoints,setEdges))
        {
            if(!calculatedges(numberOfEdges,points,numberOfPoints,setEdges,minedgelength,maxedgelength,strokecolor))
            {
                calculatepoints(numberOfPoints,setPoints,width,height,radius,pointcolor,strokecolor);
            }
        }
        else
        {
            setFinalGraphBuilt(true);
            let funclist=connectedgraph(points,edges,setPoints,setEdges,pointvisitcolor,pointqueuecolor,edgetraversecolor,finalpathcolor,setDisplayText,true);
            // console.log(funclist);
            // console.log(points);
            let funcindex=0;
            let timer=setInterval(() => {
                if(funcindex>=funclist.length)
                {
                    clearInterval(timer);
                }
                else
                {
                    funclist[funcindex++]();
                }
            }, 400);
        }
    },[edges]);

    let circles=points.map(({x,y,color},index)=>{
        return <Circle key={(x*1000+y)} x={x} y={y} radius={radius} fill={(index>1)?color:((index==0)?"#3E7C40":"#A31111")}/>
    })

    let lines=edges.map((edge)=><Line key={edge.start*numberOfPoints*100+edge.end} points={[points[edge.start].x,points[edge.start].y,points[edge.end].x,points[edge.end].y]} stroke={edge.strokecolor} strokeWidth={7} />)
    return (
        <Stage width={width} height={height} >
            <Layer>
                
                {(finalGraphBuilt)?lines:""}
                {(finalGraphBuilt)?circles:""}
                
            </Layer>
        </Stage>
    )
}