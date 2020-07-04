import axios from 'axios';
import { ScreenTypeInput } from '../interfaces/screenType';

// export function getAllScreenTypes(): Promise<AxiosResponse> {
//   return axios.get('/screenTypes');
// }

export const getAllScreenTypes = () => {
  return axios.get('/screen-types');
}

export const addScreenType = (data: ScreenTypeInput) => {
  return axios.post('/screen-types', data);
}

export const updateScreenType = (id: string, data: ScreenTypeInput) => {
  return axios.put(`/screen-types/${id}`, data);
}

export const deleteScreenType = (id: string) => {
  return axios.delete(`/screen-types/${id}`);
}