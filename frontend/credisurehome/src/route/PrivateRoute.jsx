import React from 'react'
import { Navigate } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'


const PrivateRoute = ({children}) => {
    const token = localStorage.getItem('access_token')
    if(!token){
        return <Navigate to='/unauthorized' replace/>
    }
    try{
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000

      if (decoded.exp < currentTime){
        localStorage.removeItem('access_token')
        return <Navigate to='/unauthorized' replace/>
      }
      return children
    }catch (err){
      localStorage.removeItem('access_token')
      return <Navigate to='/unauthorized' replace/>
    }
  
}

export default PrivateRoute
