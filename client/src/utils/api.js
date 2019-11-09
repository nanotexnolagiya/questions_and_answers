import axios from 'axios'
console.log(process.env)
export default axios.create({
  baseURL: `${process.env.HOSTNAME}/api/v1`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-access-token': localStorage.getItem('user-token') || ''
  }
})
