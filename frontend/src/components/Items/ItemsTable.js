import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ItemsTable.css';

function ItemsTable() {
    const [items, setItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newSerialNumber, setNewSerialNumber] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const productTypeId = useParams().productTypeId;

    useEffect(() => {
      // Construct URL based on whether searchTerm is present
      let url = `http://localhost:3000/api/v1/product_types/${productTypeId}/items`;
      if (searchTerm) {
          url += `?serial_number=${searchTerm}`;
      }

      fetch(url)
          .then(res => {
              if (res.ok) {
                  return res.json();
              } else {
                  throw new Error('Failed to fetch items.');
             }
          })
          .then(data => {
              setItems(data);
              setIsLoaded(true);
          })
          .catch(error => {
              setIsLoaded(true);
              console.error("Error fetching items:", error);
          });
    }, [productTypeId, searchTerm]);


    const handleSoldChange = (itemId) => {
        const itemToUpdate = items.find(item => item.id === itemId);
        const updatedStatus = !itemToUpdate.sold;

        fetch(`http://localhost:3000/api/v1/product_types/${productTypeId}/items/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sold: updatedStatus })
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Failed to update sold status.');
            }
        })
        .then(updatedItem => {
            setItems(prevItems => prevItems.map(item => item.id === itemId ? updatedItem : item));
        });
    };

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleSaveChanges = () => {
        if (editingItem) {
            const url = `http://localhost:3000/api/v1/product_types/${productTypeId}/items/${editingItem.id}`;
            fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item: { serial_number: editingItem.serial_number } })
            })
            .then(res => {
                if (res.ok) {
                    setItems(prevItems => prevItems.map(item => item.id === editingItem.id ? editingItem : item));
                    setEditingItem(null); // Exit edit mode
                } else {
                    throw new Error('Failed to update the item');
                }
            })
            .catch(error => {
                console.error('Error updating item:', error);
            });
        }
    };

    const handleDelete = (itemId) => {
        fetch(`http://localhost:3000/api/v1/product_types/${productTypeId}/items/${itemId}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to delete item');
                }
            })
            .then(() => {
                setItems(prevItems => prevItems.filter(item => item.id !== itemId));
            })
            .catch(error => {
                console.error('Error deleting item:', error);
            });
    };

    const handleAddNewItem = () => {
      fetch(`http://localhost:3000/api/v1/product_types/${productTypeId}/items`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ item: { serial_number: newSerialNumber } })
      })
      .then(res => {
          if (!res.ok) {
              return res.json().then(err => {
                  throw new Error(err.message || 'Failed to add the new item');
              });
          }
          return res.json();
      })
      .then(newItem => {
          console.log('Received item from backend:', newItem);
          setItems(prevItems => [...prevItems, newItem.item]);
          // setItems(prevItems => [...prevItems, newItem]);
          setModalOpen(false);
          setNewSerialNumber('');
      })
      .catch(error => {
          console.error('Error adding new item:', error);
      });
    };


    if (!isLoaded) return <div>Loading...</div>;

    // funstion to handle the search
    const handleSearch = () => {
      // This will update searchTerm and trigger the useEffect to fetch items based on the search.
      setSearchTerm(searchTerm);
    };

    return (
        <div>
            <button onClick={() => setModalOpen(true)}>Add New Item</button>

            {modalOpen && (
                <div>
                    <h3>Add New Item</h3>
                    <label>
                        Serial Number:
                        <input
                            value={newSerialNumber}
                            onChange={(e) => setNewSerialNumber(e.target.value)}
                        />
                    </label>
                    <button onClick={handleAddNewItem}>Submit</button>
                    <button onClick={() => setModalOpen(false)}>Cancel</button>
                </div>
            )}

            {/* Search by Serial Number input */}

            <div>
                <label>
                    Search by Serial Number:
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter serial number..."
                    />
                </label>
                <button onClick={handleSearch}>Search</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Serial Number</th>
                        <th>SOLD</th>
                        <th>Tools</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>
                                {editingItem && editingItem.id === item.id ? (
                                    <input
                                        value={editingItem.serial_number}
                                        onChange={(e) => setEditingItem(prev => ({...prev, serial_number: e.target.value}))}
                                    />
                                ) : item.serial_number}
                            </td>
                            <td>
                                <input type="checkbox" checked={item.sold} onChange={() => handleSoldChange(item.id)} />
                            </td>
                            <td>
                                {editingItem && editingItem.id === item.id ? (
                                    <button onClick={handleSaveChanges}>Save</button>
                                ) : (
                                    <button onClick={() => handleEdit(item)}>Edit</button>
                                )}
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ItemsTable;
