import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductTypesTable() {
    const [productTypes, setProductTypes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductType, setCurrentProductType] = useState({});
    const [editedProductType, setEditedProductType] = useState({});
    const [csrfToken, setCsrfToken] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/api/v1/product_types')
            .then(response => {
                setProductTypes(response.data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });

        // Fetch the CSRF token from the meta tag
        const tokenElement = document.querySelector('[name="csrf-token"]');
        if (tokenElement) {
            setCsrfToken(tokenElement.getAttribute('content'));
        }
    }, []);

    const handleEditClick = (productType) => {
        setCurrentProductType(productType);
        setEditedProductType(productType);
        setIsEditing(true);
    };

    async function handleEditSubmit(event) {
        event.preventDefault();

        try {
            const response = await axios.put(`http://localhost:3000/api/v1/product_types/${currentProductType.id}`, editedProductType, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                }
            });

            if (response.status === 200) {
                // Handle success logic, for example updating the productTypes state with the updated product type.
                setProductTypes(prevProductTypes => prevProductTypes.map(pt => pt.id === currentProductType.id ? response.data : pt));
                setIsEditing(false); 
            } else {
                // Handle failure logic
                console.error("Failed to update product type.");
            }
        } catch (error) {
            console.error("Error updating the product type:", error);
            console.error("Server response:", error.response.data);
        }
    }

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
                            onChange={e => setEditedProductType({ ...editedProductType, name: e.target.value })}
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
