import axios from 'axios';
import queryString from 'query-string';
import { PriceHistoryInterface, PriceHistoryGetQueryInterface } from 'interfaces/price-history';
import { GetQueryInterface } from '../../interfaces';

export const getPriceHistories = async (query?: PriceHistoryGetQueryInterface) => {
  const response = await axios.get(`/api/price-histories${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPriceHistory = async (priceHistory: PriceHistoryInterface) => {
  const response = await axios.post('/api/price-histories', priceHistory);
  return response.data;
};

export const updatePriceHistoryById = async (id: string, priceHistory: PriceHistoryInterface) => {
  const response = await axios.put(`/api/price-histories/${id}`, priceHistory);
  return response.data;
};

export const getPriceHistoryById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/price-histories/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePriceHistoryById = async (id: string) => {
  const response = await axios.delete(`/api/price-histories/${id}`);
  return response.data;
};
