import axios from 'axios';

export const getReportOfMonth = (time: String) => {
  return axios.post('/reports', { time: time });
}