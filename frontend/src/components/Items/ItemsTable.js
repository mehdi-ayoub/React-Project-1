import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ItemsTable() {
    console.log("ItemsTable component mounted");
    const [items, setItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
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
              console.log("Fetched items:", data);
              setItems(data);
              setIsLoaded(true);
          })
          .catch(error => {
              setIsLoaded(true);
              setError(error);
          });
    }, [productTypeId]);

    const handleSoldChange = (itemId) => {
        const itemToUpdate = items.find(item => item.id === itemId);
        const updatedStatus = !itemToUpdate.sold;

        fetch(`/api/v1/items/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sold: updatedStatus })
        })
        .then(res => res.json())
        .then(updatedItem => {
            setItems(prevItems => prevItems.map(item => item.id === itemId ? updatedItem : item));
        });
    };

    const handleDelete = (itemId) => {
        fetch(`/api/v1/items/${itemId}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
                setItems(prevItems => prevItems.filter(item => item.id !== itemId));
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
                            <td>{item.serial_number}</td>
                            <td>
                                <input type="checkbox" checked={item.sold} onChange={() => handleSoldChange(item.id)} />
                            </td>
                            <td>
                                <button>Edit</button>
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
