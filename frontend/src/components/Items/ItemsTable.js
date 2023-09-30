import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ItemsTable.css';
import GoogleMapReact from 'google-map-react';
import {
  fetchItemsRequest,
  soldItemRequest,
  addItemRequest,
  deleteItemRequest,
  editItemRequest
} from '../../services/item';
function ItemsTable() {
    const [items, setItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newSerialNumber, setNewSerialNumber] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const productTypeId = useParams().productTypeId;

    useEffect(() => {
        fetchItems()
    }, [productTypeId, searchTerm]);

    const fetchItems= ()=>{
      fetchItemsRequest(searchTerm,productTypeId)
      .then(response => {
        console.log(response.data,'itemssssssss')
        setItems(response.data);
        setIsLoaded(true);
      })
      .catch(error => {
        setIsLoaded(true);
        console.error("Error fetching items:", error);
      });
    }


    const handleSoldChange = (itemId) => {
        const itemToUpdate = items.find(item => item.id === itemId);
        const updatedStatus = !itemToUpdate.sold;
        soldItemRequest(productTypeId,itemId,JSON.stringify({ sold: updatedStatus }))
        .then(response => {
          if (response.status==200){
            setItems(prevItems => prevItems.map(item => item.id === itemId ? response.data : item));
          }
          else{
            console.error("Error updating items:");
          }
        })
        .catch(error => {
          console.error("Error updating items:", error);
        });
    };

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleSaveChanges = () => {
      if (editingItem) {
        editItemRequest(productTypeId,editingItem.id,JSON.stringify({ item: { serial_number: editingItem.serial_number } }) )
        .then(response => {
          if(response.status==200){
            setItems(prevItems => prevItems.map(item => item.id === editingItem.id ? editingItem : item));
            setEditingItem(null); // Exit edit mode
          }
        })
        .catch(error => {
          console.error('Error updating item:', error);
        });
      }
    };

    const handleDelete = (itemId) => {
      deleteItemRequest(productTypeId,itemId)
      .then(() => {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      })
      .catch(error => {
        console.error('Error deleting item:', error);
      });
    };

    const handleAddNewItem = (event) => {
      event.preventDefault();
      addItemRequest(productTypeId,JSON.stringify({ item: { serial_number: newSerialNumber, sold:false } }))
      .then(response => {
        if(response.status==201){
          setItems(prevItems => [...prevItems, response.data.item]);
          setModalOpen(false);
          setNewSerialNumber('');
        }
        else{
          console.error('Error adding new item:');
        }
      })
      .catch(error => {
          console.error('Error adding new item:', error);
      });
    };


    if (!isLoaded) return <div>Loading...</div>;

    const center = {
      lat: 33.86820715541003,
      lng: 35.55123310626341
    }
    return (
        <div>

          <div className="banner-product">
            {/* <img src={process.env.PUBLIC_URL + '/images/green_landscape.jpeg'} alt="Banner" /> */}
          </div>

          <div className="first-header-products">
            <p className="first-header-title">Product Items</p>
            <button className="first-header-button" onClick={() => setModalOpen(true)}>Add New Item</button>
          </div>

            {modalOpen && (
                <div className="add-popup"> {/* Use the same "add-popup" class */}
                    <h3>Add New Item</h3>
                    <form onSubmit={handleAddNewItem}> {/* Use a <form> element for consistency */}
                        <div className="form-group"> {/* Use the same "form-group" class */}
                            <label>Serial Number:</label>
                            <input
                                value={newSerialNumber}
                                onChange={(e) => setNewSerialNumber(e.target.value)}
                            />
                        </div>
                        <div className="button-group"> {/* Use the same "button-group" class */}
                            <button className="first-header-button" type="submit">Submit</button>
                            <button className="first-header-button" type="button" onClick={() => setModalOpen(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search by Serial Number input */}

            <div className="search-container-products">
              <p className="search-container-subtitle">Search Item </p>

              <input
                className="search-bar-products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter serial number..."
              />

            </div>
            {/* <div>
                <label>
                    Search by Serial Number:
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter serial number..."
                    />
                </label>
                <button onClick={handleSearch}>Search</button>
            </div> */}

          <div className="table-and-map">
            <table className="table-container-main-items">
              <thead>
                  <tr>
                      <th className="table-container-head">ID</th>
                      <th className="table-container-head">Serial Number</th>
                      <th className="table-container-head">SOLD</th>
                      <th className="table-container-head">Tools</th>
                  </tr>
              </thead>
              <tbody>
                  {items.map(item => (
                      <tr key={item.id}>
                          <td className="table-container-body table-cell" >{item.id}</td>
                          <td className="table-container-body table-cell" >
                              {editingItem && editingItem.id === item.id ? (
                                  <input
                                      value={editingItem.serial_number}
                                      onChange={(e) => setEditingItem(prev => ({...prev, serial_number: e.target.value}))}
                                  />
                              ) : item.serial_number}
                          </td>
                          <td className="table-container-body table-cell" >
                              <input type="checkbox" checked={item.sold} onChange={() => handleSoldChange(item.id)} />
                          </td>
                          <td className="table-container-body table-cell" >
                              {editingItem && editingItem.id === item.id ? (
                                  <button className="first-header-button" onClick={handleSaveChanges}>Save</button>
                              ) : (
                                  <button className="first-header-button" onClick={() => handleEdit(item)}>Edit</button>
                              )}
                              <button className="first-header-button" style={{ marginLeft: '10px' }} onClick={() => handleDelete(item.id)}>Delete</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
            </table>
            <div className="map-container">

              <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyBZtOz1stMpCRBZ3pAb2DOprPZKb-FCT2g' }}
                center={center}
                zoom = {11}
              >
              </GoogleMapReact>
            </div>
          </div>
        </div>
    );
}

export default ItemsTable;
