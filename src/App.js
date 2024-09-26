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
  const gridRef = useRef(null);
  let ready = false;

  useEffect(() => {
    //const localMapRaw = localStorage.getItem('linkMap');
    //if (localMapRaw) setLinkMap(JSON.parse(localMapRaw));

    //console.log(linkMap);
  }, []);

  useImperativeHandle(gridRef, () => {
    if (!ready) {
      gridRef.current.scrollToCell({idx: columns.length/2, rowIdx: rows.length/2});
      ready = true;
    }
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
    console.log(linkMap);
  }

  async function handleScroll(e) {
    // if (isLoading || !isAtBottom(e)) return;

    // setIsLoading(true);

    // // await loadMoreRowsAsync();

    // setIsLoading(false);
  }

  for (let x=0; x<WORLD_SIZE; x++) {
    columns.push({key: `x${x}`, name: `X${x}`,
      renderCell({ row }) {
        return <div style={{color: '#333', lineHeight: '47px', margin:'auto', width: '50px', height: '50px', backgroundColor: '#000'}}>
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
      <DataGrid ref={gridRef} columns={columns} rows={rows} rowHeight={50} class="fill-grid" style={{ height: '100%' }}
        onScroll={handleScroll}
        onSelectedCellChange={onSelect} />
    </div>
  );
}

export default App;
