import axios from 'axios';
import { MovieInsertInput, MovieUpdateInput } from '../interfaces/movie';

// export function getAllMovies(): Promise<AxiosResponse> {
//   return axios.get('/movies');
// }

export const getAllMovies = () => {
  return axios.get('/movies');
}

export const addMovie = (data: MovieInsertInput) => {
  return axios.post('/movies', data);
}

export const updateMovie = (id: string, data: MovieUpdateInput) => {
  return axios.put(`/movies/${id}`, data);
}

export const deleteMovie = (id: string) => {
  return axios.delete(`/movies/${id}`);
}