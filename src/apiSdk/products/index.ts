import axios from 'axios';
import queryString from 'query-string';
import { ProductInterface, ProductGetQueryInterface } from 'interfaces/product';
import { GetQueryInterface } from '../../interfaces';

export const getProducts = async (query?: ProductGetQueryInterface) => {
  const response = await axios.get(`/api/products${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createProduct = async (product: ProductInterface) => {
  const response = await axios.post('/api/products', product);
  return response.data;
};

export const updateProductById = async (id: string, product: ProductInterface) => {
  const response = await axios.put(`/api/products/${id}`, product);
  return response.data;
};

export const getProductById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/products/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteProductById = async (id: string) => {
  const response = await axios.delete(`/api/products/${id}`);
  return response.data;
};
