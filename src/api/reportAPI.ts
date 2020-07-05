import axios from 'axios';

export const getReportOfMonth = (time: String) => {
  return axios.post('/Reports', { date: time });
}