import axios from 'axios';
import { RateInput } from '../interfaces/rate';

export const getAllRates = () => {
  return axios.get('/rates');
}

export const addRate = (data: RateInput) => {
  return axios.post('/rates', data);
}

export const updateRate = (id: string, data: RateInput) => {
  return axios.put(`/rates/${id}`, data);
}

export const deleteRate = (id: string) => {
  return axios.delete(`/rates/${id}`);
}