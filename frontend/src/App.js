import logo from './logo.svg';
import './App.css';
import React from 'react';
import ProductTypesTable from './components/ProductTypes/ProductTypesTable';

function App() {
  return (
    <div className="App">
      <h1>Product Types</h1>
      <ProductTypesTable />
  </div>
  );
}

export default App;
