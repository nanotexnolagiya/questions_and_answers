import axios from 'axios'
// import store from '../store'

export default axios.create({
  baseURL: 'http://localhost:3330/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-access-token': localStorage.getItem('user-token') || ''
  }
})
