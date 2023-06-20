import axios from 'axios';
import queryString from 'query-string';
import { StoreInterface, StoreGetQueryInterface } from 'interfaces/store';
import { GetQueryInterface } from '../../interfaces';

export const getStores = async (query?: StoreGetQueryInterface) => {
  const response = await axios.get(`/api/stores${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createStore = async (store: StoreInterface) => {
  const response = await axios.post('/api/stores', store);
  return response.data;
};

export const updateStoreById = async (id: string, store: StoreInterface) => {
  const response = await axios.put(`/api/stores/${id}`, store);
  return response.data;
};

export const getStoreById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/stores/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteStoreById = async (id: string) => {
  const response = await axios.delete(`/api/stores/${id}`);
  return response.data;
};
