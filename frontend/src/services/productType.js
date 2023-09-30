import api from './base'

export const fetchProductsRequest = async () => {
    return await api.get(`/product_types`);
}

export const deleteProductRequest = async (id) => {
    return await api.delete(`/product_types/${id}`);
}

export const editProductRequest = async (id, data, csrfToken) => {
    return await api.put(`/product_types/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
        }
    });
}

export const addProductRequest = async (data, csrfToken) => {
    return await api.post(`/product_types`, data, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
        }
    });
}
