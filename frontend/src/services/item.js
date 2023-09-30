import api from './base'

export const fetchItemsRequest = async (searchTerm, productTypeId) => {
  if(searchTerm){
    return await api.get(`product_types/${productTypeId}/items?serial_number=${searchTerm}`)
  }
  return await api.get(`product_types/${productTypeId}/items`)
}

export const soldItemRequest=async (productTypeId,itemId, data)=>{
  return await api.patch(`product_types/${productTypeId}/items/${itemId}`,data,{
    headers: {
      'Content-Type': 'application/json',
    }
  })
}
export const deleteItemRequest = async (productTypeId,itemId) => {
    return await api.delete(`product_types/${productTypeId}/items/${itemId}`);
}

export const editItemRequest = async (productTypeId,id, data) => {
    return await api.patch(`product_types/${productTypeId}/items/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const addItemRequest = async (productTypeId,data) => {
  return await api.post(`product_types/${productTypeId}/items`, data, {
    headers: {
        'Content-Type': 'application/json',
    }
  });
}
