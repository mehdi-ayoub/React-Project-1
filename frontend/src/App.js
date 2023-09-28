

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route

import ProductTypesTable from './components/ProductTypes/ProductTypesTable';
import ItemsTable from './components/Items/ItemsTable';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes> {/* Use Routes instead of Switch */}
          <Route path="/" element={<ProductTypesTable />} /> {/* Use element prop */}
          <Route path="/items/:productTypeId" element={<ItemsTable />} /> {/* Use element prop */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
