import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ItemsTable() {
    const [items, setItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const productTypeId = useParams().productTypeId;

    useEffect(() => {
        fetch(`http://localhost:3000/api/v1/product_types/${productTypeId}/items`)
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
    }, [productTypeId]);


    const handleSoldChange = (itemId) => {
      const itemToUpdate = items.find(item => item.id === itemId);
      const updatedStatus = !itemToUpdate.sold;

      // Update the URL here
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
      console.log("productTypeId:", productTypeId);
      // console.log("editingItem:", editingItem);

        setEditingItem(item);
    };

    const handleSaveChanges = () => {
      if (editingItem) {
        const url = `http://localhost:3000/api/v1/product_types/${productTypeId}/items/${editingItem.id}`;

        console.log("PATCH URL:", url);
        console.log("Editing Item:", editingItem);

        // Make a PATCH request to the API with the updated serial number
        fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ item: { serial_number: editingItem.serial_number } }) // Here is the update
        })
        .then(res => {
          if (res.ok) {
            console.log("Server Response:", res);
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


    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div>
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
