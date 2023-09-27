import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductTypesTable() {
    // Define your state
    const [productTypes, setProductTypes] = useState([]);

    // Use the useEffect hook to make the API call when the component mounts
    useEffect(() => {
        axios.get("/api/v1/product_types")
            .then(response => {
                setProductTypes(response.data);
            })
            .catch(error => {
                console.error("Error fetching the product types:", error);
            });
    }, []);  // Empty dependency array means this useEffect runs once when component mounts

    // Function to handle Edit click (this will be elaborated later)
    const handleEditClick = (id) => {
        console.log('Edit clicked for product type with ID:', id);
        // Logic to handle editing will go here...
    }

    // Function to handle Remove click (this will be elaborated later)
    const handleRemoveClick = (id) => {
        console.log('Remove clicked for product type with ID:', id);
        // Logic to handle removal will go here...
    }

    return (
        <div>
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
                                <button onClick={() => handleEditClick(productType.id)}>Edit</button>
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
