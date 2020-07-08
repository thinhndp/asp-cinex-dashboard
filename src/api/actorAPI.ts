import axios from 'axios';
import { ActorInput } from '../interfaces/actor';

export const getAllActors = () => {
  return axios.get('/actors');
}

export const addActor = (data: ActorInput) => {
  return axios.post('/actors', data);
}

export const updateActor = (id: string, data: ActorInput) => {
  return axios.put(`/actors/${id}`, data);
}

export const deleteActor = (id: string) => {
  return axios.delete(`/actors/${id}`);
}