import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductTypesTable.css';

function ProductTypesTable() {
    const [productTypes, setProductTypes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductType, setCurrentProductType] = useState({});
    const [editedProductType, setEditedProductType] = useState({});
    const [csrfToken, setCsrfToken] = useState(null);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [newProductType, setNewProductType] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/api/v1/product_types')
            .then(response => {
                console.log(response.data);
                setProductTypes(response.data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });

        const tokenElement = document.querySelector('[name="csrf-token"]');
        if (tokenElement) {
            setCsrfToken(tokenElement.getAttribute('content'));
        }
    }, []);
    // to edit the item here
    const handleEditClick = (productType) => {
        setCurrentProductType(productType);
        setEditedProductType(productType);
        setIsEditing(true);
    };

    const handleRemoveClick = (id) => {
        axios.delete(`http://localhost:3000/api/v1/product_types/${id}`)
            .then(response => {
                if (response.status === 200) {
                    const updatedProductTypes = productTypes.filter(pt => pt.id !== id);
                    setProductTypes(updatedProductTypes);
                }
            })
            .catch(error => {
                console.error("Error deleting product type:", error);
            });
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
                const updatedProductType = { ...currentProductType, ...response.data };
                setProductTypes(prevProductTypes => prevProductTypes.map(pt => pt.id === currentProductType.id ? updatedProductType : pt));
                setIsEditing(false);
            } else {
                console.error("Failed to update product type.");
            }
        } catch (error) {
            console.error("Error updating the product type:", error);
            console.error("Server response:", error.response.data);
        }
    }

    const handleAddSubmit = (event) => {
        event.preventDefault();

        const data = {
            product_type: {
                name: newProductType.name,
                description: newProductType.description,
                image: newProductType.image
            }
        };

        axios.post('http://localhost:3000/api/v1/product_types', data, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            }
        })
        .then(response => {
            if (response.status === 201) {
                alert('Product Type created successfully!');
                const newProductWithTypeCount = {
                    ...response.data.product_type,
                    items_count: 0
                };
                setProductTypes(prevTypes => [...prevTypes, newProductWithTypeCount]);
                setShowAddPopup(false);
                setNewProductType({});
            }
        })
        .catch(error => {
            if (error.response && error.response.data && error.response.data.errors) {
                alert('Error: ' + error.response.data.errors.join(', '));
            } else {
                alert('An unexpected error occurred.');
            }
        });
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            setNewProductType(prev => ({ ...prev, image: file }));
        }
    }

    // Filter the product types based on the search term
    const filteredProductTypes = productTypes.filter(pt => pt.name.toLowerCase().includes(searchTerm.toLowerCase()));

    //---------------- start of the return funtion ----------


    return (

      <div>

        <div className="banner-product">
          {/* <img src={process.env.PUBLIC_URL + '/images/green_landscape.jpeg'} alt="Banner" /> */}
        </div>


        <div className="first-header-products">
          <p className="first-header-title">Products</p>
          <button className="first-header-button" onClick={() => setShowAddPopup(true)}>Add New Product</button>
        </div>

        <div className="search-container-products">
          <p className="search-container-subtitle">Search Product</p>
          <input
            className="search-bar-products"
            type="text"
            placeholder="Search by product type name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isEditing && (
          <div className="add-popup">
            <h2>Edit Product Type</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editedProductType.name || ''}
                  onChange={e => setEditedProductType({ ...editedProductType, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={editedProductType.description || ''}
                  onChange={e => setEditedProductType({ ...editedProductType, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Image:</label>
                <input type="file" onChange={handleFileChange} />
              </div>
              <div className="button-group">
                <button className="first-header-button" style={{ marginLeft: '10px' }} type="submit">Update Product Type</button>
                <button className="first-header-button" style={{ marginLeft: '10px' }} type="button" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}


        {showAddPopup && (
          <div className="add-popup">
            <h2>Add New Product Type</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input type="text" value={newProductType.name || ''} onChange={e => setNewProductType({ ...newProductType, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea rows="4" value={newProductType.description || ''} onChange={e => setNewProductType({ ...newProductType, description: e.target.value })}></textarea>
              </div>
              <div className="form-group">
                <label>Add Image:</label>
                <input type="file" onChange={handleFileChange} />
              </div>
              <div className="button-group">
                <button className="first-header-button" style={{ marginLeft: '10px' }} type="submit">Add Product</button>
                <button className="first-header-button" style={{ marginLeft: '10px' }} type="button" onClick={() => setShowAddPopup(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="table-container-main">
          <table>
            <thead>
              <tr>
                <th className="table-container-head">ID</th>
                <th className="table-container-head">Name</th>
                <th className="table-container-head">Description</th>
                <th className="table-container-head">Count</th>
                <th className="table-container-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductTypes.map((productType) => (
                <tr key={productType.id}>
                  <td className="table-container-body table-cell">{productType.id}</td>
                  <td className="table-container-body table-cell"><Link className="neutral-link" to={`/items/${productType.id}`}>{productType.name}</Link></td>
                  <td className="table-container-body table-cell">{productType.description}</td>
                  <td className="table-container-body table-cell">{productType.items_count}</td>
                  <td className="table-container-body table-cell">
                    <button className="table-buttons" onClick={() => handleEditClick(productType)}>Edit</button>
                    <button className="table-buttons-remove" onClick={() => handleRemoveClick(productType.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    );



    //---------------- end of the return funtion ----------

}

export default ProductTypesTable;
