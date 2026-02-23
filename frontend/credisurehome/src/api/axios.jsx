import axios from 'axios';

const API = axios.create({
    baseURL : 'http://127.0.0.1:8000/api/',
})

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token && token !== 'undefined' && token !== 'null'){
            config.headers.Authorization = `Bearer ${token}`
        }else{
            delete config.headers.Authorization
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default API;