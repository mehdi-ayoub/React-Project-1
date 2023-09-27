// ProductTypeTable.js
import React from 'react';
import * as ReactDOM from 'react-dom'

const ProductTypeTable = ({ productTypes }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Product Type Name</th>
          <th>Count</th>
          <th>Tools</th>
        </tr>
      </thead>
      <tbody>
        {productTypes.map((productType) => (
          <tr key={productType.id}>
            <td>{productType.id}</td>
            <td>{productType.name}</td>
            <td>{productType.item_count}</td>
            <td>
              <button>Edit</button>
              <button>Remove</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

document.addEventListener('DOMContentLoaded', () => {

  ReactDOM.render(<ProductTypeTable />, document.getElementById('producttypetable'))

})

export default ProductTypeTable;
