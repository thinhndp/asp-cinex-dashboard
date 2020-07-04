import axios from 'axios';
import { DiscountInput } from '../interfaces/discount';

export const getAllDiscounts = () => {
  return axios.get('/discounts/all-discounts');
}

export const getAllActiveDiscounts = () => {
  return axios.get('/discounts');
}

export const getDiscountById = (id: string) => {
  return axios.get(`/discounts/${id}`);
}

export const addDiscount = (data: DiscountInput) => {
  return axios.post('/discounts', data);
}

export const updateDiscount = (id: string, data: DiscountInput) => {
  return axios.put(`/discounts/${id}`, data);
}

export const deleteDiscount = (id: string) => {
  return axios.delete(`/discounts/${id}`);
}