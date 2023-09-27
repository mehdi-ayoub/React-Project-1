import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductTypesTable() {
    const [productTypes, setProductTypes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductType, setCurrentProductType] = useState({});
    const [editedProductType, setEditedProductType] = useState({}); // This will hold the data of the product type currently being edited

    useEffect(() => {
        axios.get('http://localhost:3000/api/v1/product_types')
            .then(response => {
                setProductTypes(response.data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleEditClick = (productType) => {
        setCurrentProductType(productType);
        setEditedProductType(productType); // Set the current data for the form
        setIsEditing(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3000/api/v1/product_types/${currentProductType.id}`, editedProductType)
             .then(response => {
                 const updatedProductTypes = productTypes.map(pt =>
                     pt.id === currentProductType.id ? response.data : pt
                 );
                 setProductTypes(updatedProductTypes);
                 setIsEditing(false);
             })
             .catch(error => {
                 console.error("Error updating the product type:", error);
             });
    };

    const handleRemoveClick = (id) => {
        console.log('Remove clicked for product type with ID:', id);
        // Logic to handle removal will go here...
    }

    return (
        <div>
            {isEditing && (
                <form onSubmit={handleEditSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={editedProductType.name || ''}
                            onChange={e => setEditedProductType({...editedProductType, name: e.target.value})}
                        />
                    </label>
                    <button type="submit">Update Product Type</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            )}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Count</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {productTypes.map(productType => (
                        <tr key={productType.id}>
                            <td>{productType.id}</td>
                            <td>{productType.name}</td>
                            <td>{productType.items_count}</td>
                            <td>
                                <button onClick={() => handleEditClick(productType)}>Edit</button>
                                <button onClick={() => handleRemoveClick(productType.id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductTypesTable;
