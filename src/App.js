import 'react-data-grid/lib/styles.css';
import { useState, useLayoutEffect, useImperativeHandle, useRef, useEffect } from 'react';

import logo from './logo.svg';
import './App.css';

import DataGrid from 'react-data-grid';

const WORLD_SIZE = 1000;

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function isAtBottom({ currentTarget }) {
  return currentTarget.scrollTop + 20 >= currentTarget.scrollHeight - currentTarget.clientHeight;
}

// function setRandomColor() {
//   $("#colorpad").css("background-color", getRandomColor());
// }

function App() {
  const localMapRaw = localStorage.getItem('linkMap');
  
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setcolumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [linkMap, setLinkMap] = useState(localMapRaw ? JSON.parse(localMapRaw) : {});
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [pos, setPos] = useState({x:WORLD_SIZE/2, y:WORLD_SIZE/2});
  const [mapRect, setMapRect] = useState({x:0, y:0, width: (window.innerWidth/50)/WORLD_SIZE * 200, height: (window.innerHeight/50)/WORLD_SIZE * 200});
  const gridRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // window.addEventListener('scroll', handleScroll);
    // return () => window.removeEventListener('scroll', handleScroll);
    //const localMapRaw = localStorage.getItem('linkMap');
    //if (localMapRaw) setLinkMap(JSON.parse(localMapRaw));

    //console.log(linkMap);
  }, []);

  useImperativeHandle(gridRef, () => {
    gridRef.current.scrollToCell({idx: pos.x, rowIdx: pos.y});
  }, []);

  function refreshRows() {
  }

  async function loadMoreRowsAsync() {
    return new Promise((resolve) => {
      const newRows = [];
  
      // for (let y = totalRows; y < newRowsCount; y++) {
      //   const row = {};
      //   for (let x = 0; x < totalColumns; x++) {
      //     row[`x${x}`] = `X${x}Y${y}`;
      //   }
  
      //   newRows.push(row);
      // }
  
      setTimeout(() => resolve(newRows), 1000);
    });
  }  

  function onSelect(cell) {
    console.log(`Selected cell @${cell.row[cell.column.key]}`);
    console.log(cell);
    linkMap[cell.row[cell.column.key]] = `https://placehold.co/40x40/${getRandomColor()}/png`;
    localStorage.setItem('linkMap', JSON.stringify(linkMap));
  }

  let timer = null;
  function handleScroll(e) {
    const grid = e.target;
    const boundRect = grid.getBoundingClientRect();

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
    setMapRect({
      width: mapRect.width,
      height: mapRect.height,
      x: ((grid.scrollLeft)/(grid.scrollWidth-boundRect.width)) * 200 + 1,
      y: ((grid.scrollTop)/(grid.scrollHeight-boundRect.height)) * 200 + 1
    });
    }, 100);
  }

  for (let x=0; x<WORLD_SIZE; x++) {
    columns.push({key: `x${x}`, name: `X${x}`,
      renderCell({ row }) {
        return <div style={{color: '#333', lineHeight: '50px', margin:'auto', width: '50px', height: '50px', backgroundColor: '#000'}}>
          { !linkMap[row[`x${x}`]] ? row[`x${x}`] :
            <img src={linkMap[row[`x${x}`]]} style={{margin: 'auto', padding:0, borderRadius: '5px', verticalAlign: 'middle'}} />
          }
        </div>
      }
    });
  }

  for (let y=0; y<WORLD_SIZE; y++) {
    const row = {};
    for (let x=0; x<WORLD_SIZE; x++) {
      row[`x${x}`] = `X${x}Y${y}`;
    }

    rows.push(row);
  }

  //grid.current.scrollTop = 100;

  return (
    <div className="App" style={{height: size.height}}>
      <DataGrid ref={gridRef} columns={columns} rows={rows} rowHeight={50} class="fill-grid" style={{ height: size.height }}
        onScroll={handleScroll}
        onSelectedCellChange={onSelect} />
      <div style={{position:'absolute', left: 0, bottom: 0, padding:0, margin: 0, width: '200px', height: '200px', backgroundColor: '#fff', cursor: 'zoom-in', opacity: .7}} >
        <SvgMap linkMap={linkMap} gridRef={gridRef} mapRect={mapRect}></SvgMap>
      </div>
    </div>
  );
}

function SvgMap({linkMap: linkMap, gridRef: gridRef, mapRect: mapRect}) {
  const [fills, setFills] = useState([]);
  const [isScrolling, setScrolling] = useState(false);

  // useEffect((gridRef) => {
  //   // console.log(gridRef.currentTarget);
  //   // const x = gridRef.current.target.scrollLeft;
  //   // const y = gridRef.current.target.scrollTop;
  //   // setPos({x: x, y: y});
  // }, [gridRef]);

  // useImperativeHandle(gridRef, () => {
  //   //gridRef.current.scrollToCell({idx: pos.x, rowIdx: pos.y});
  //   //console.log(gridRef.current.scrollLeft);
  // }, []);

  for (const [key, value] of Object.entries(linkMap)) {
    const splits = key.split('Y');
    const x = splits[0].substring(1);
    const y = splits[1];
    
    fills.push({x: x, y: y});
  }

  return (
    <svg height="200" width="200"
      onClick={((e) => {
        const boundRect = e.target.getBoundingClientRect();
        const pos = {x: Math.floor(e.clientX/200 * WORLD_SIZE), y: Math.floor((e.clientY - boundRect.y)/200 * WORLD_SIZE)};
        gridRef.current.scrollToCell({idx: pos.x, rowIdx: pos.y});
      })}
    >
      {fills.map((pos, index) => {
        return <circle key={index} r="1" cx={pos.x/WORLD_SIZE * 200 + (mapRect.width/2)} cy={pos.y/WORLD_SIZE * 200 + (mapRect.height/2)} fill="red" />
      })}
      <rect width={mapRect.width} height={mapRect.height} x={mapRect.x} y={mapRect.y}
        style={{strokeWidth:.5, stroke:'#000', fillOpacity:0}} />
    </svg>
  )
}

export default App;
