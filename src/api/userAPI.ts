import axios from 'axios';
import { UserInput } from '../interfaces/user';

export const getAllUsers = () => {
  return axios.get('/users');
}

// export const addUser = (data: UserInput) => {
//   return axios.post('/users', data);
// }

export const updateUser = (id: string, data: UserInput) => {
  return axios.put(`/users/UpdateRole`, data);
}

// export const deleteUser = (id: string) => {
//   return axios.delete(`/users/${id}`);
// }