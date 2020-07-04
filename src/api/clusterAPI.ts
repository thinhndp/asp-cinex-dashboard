import axios from 'axios';
import { ClusterInput } from '../interfaces/cluster';

export const getAllClusters = () => {
  return axios.get('/clusters');
}

export const addCluster = (data: ClusterInput) => {
  return axios.post('/clusters', data);
}

export const updateCluster = (id: string, data: ClusterInput) => {
  return axios.put(`/clusters/${id}`, data);
}

export const deleteCluster = (id: string) => {
  return axios.delete(`/clusters/${id}`);
}