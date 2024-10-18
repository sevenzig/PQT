// src/client/src/App.js
// version 1.02

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import DataReview from './components/DataReview';
import QRScanner from './components/QRScanner';

function App() {
  const [manufacturer, setManufacturer] = useState('');
  const [product, setProduct] = useState('');

  const handleSearch = () => {
    // Implement your search logic here
    // You can use the `manufacturer` and `product` state variables to filter the data
    console.log(`Searching for ${manufacturer} - ${product}`);
  };

  return (
    <Router>// src/client/src/App.js
// version 1.03

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import DataReview from './components/DataReview';
import QRScanner from './components/QRScanner';

function App() {
  const [manufacturer, setManufacturer] = useState('');
  const [product, setProduct] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Implement your search logic here
    // You can use the `manufacturer`, `product`, and `lotNumber` state variables to filter the data
    // or use the `searchQuery` state variable for full-text search
    console.log(`Searching for ${manufacturer} - ${product} - ${lotNumber} or ${searchQuery}`);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
    const [mfr, prod, lot] = e.target.value.split(':').map((part) => part.trim());
    setManufacturer(mfr || '');
    setProduct(prod || '');
    setLotNumber(lot || '');
  };

  return (
    <Router>
      <div>
        <h1>Probiotic Quality Tracker</h1>
        <div>
          <input
            type="text"
            placeholder="Search (e.g., :manufacturer :product :lot or :lot)"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />
          <input
            type="text"
            placeholder="Product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />
          <input
            type="text"
            placeholder="Lot Number"
            value={lotNumber}
            onChange={(e) => setLotNumber(e.target.value)}
          />
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/file-upload">File Upload</Link>
            </li>
            <li>
              <Link to="/data-review">Data Review</Link>
            </li>
            <li>
              <Link to="/qr-scanner">QR Scanner</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/file-upload">
            <FileUpload />
          </Route>
          <Route path="/data-review">
            <DataReview />
          </Route>
          <Route path="/qr-scanner">
            <QRScanner />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

      <div>
        <h1>Probiotic Quality Tracker</h1>
        <div>
          <input
            type="text"
            placeholder="Manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />
          <input
            type="text"
            placeholder="Product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/file-upload">File Upload</Link>
            </li>
            <li>
              <Link to="/data-review">Data Review</Link>
            </li>
            <li>
              <Link to="/qr-scanner">QR Scanner</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/file-upload">
            <FileUpload />
          </Route>
          <Route path="/data-review">
            <DataReview />
          </Route>
          <Route path="/qr-scanner">
            <QRScanner />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
