import 'react-data-grid/lib/styles.css';

import logo from './logo.svg';
import './App.css';

import DataGrid from 'react-data-grid';

function App() {
  const columns = [];
  const rows = [];

  for (let x=0; x<100; x++) {
    columns.push({ key: 'x1', name: `X${x}`});
  }

  for (let y=0; y<100; y++) {
    const row = {};
    for (let x=0; x<100; x++) {
      row[`x${x}`] = `X${x}Y${y}`;
    }

    rows.push(row);
  }
  
  return (
    <div className="App">
	<DataGrid columns={columns} rows={rows} rowHeight={50} class="fill-grid" style={{height:'100%'}} />
    </div>
  );
}

export default App;
