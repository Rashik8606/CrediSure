import React, { useState } from 'react'
import API from '../api/axios';
import { Link } from 'react-router-dom';
import { getUserRole } from '../utils/auth';
import BorrowerNavBar from '../pages/BorrowerNavBar';

const ChangePassword = () => {

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, confirmSetPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const [darkMode, setDarkMode] = useState(()=>{
        const saved = localStorage.getItem('bp-theme')
        return saved ? saved === 'dark':'light'
    })

    const toggleTheme = () =>{
        const next = !darkMode
        setDarkMode(next)
        localStorage.setItem('bp-theme', next? 'dark':'light')
    }


    const role = getUserRole()

    const handleChangePassword = async(e)=>{
        e.preventDefault();
        setMessage('')
        setError('')

        try{
            const response = await API.put('/change-password/',{
                old_password:oldPassword,
                new_password:newPassword,
                confirm_password:confirmPassword
            })

            setMessage(response.data.message);
            setOldPassword('');
            setNewPassword('');
            confirmSetPassword('');
        }catch (error){
            setError(
                error.response?.data?.detail ||
                error.response?.data?.old_password ||
                'password changing failed ..!'
            )
        }

    }

  return (
    <div>
        <BorrowerNavBar
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        activePage = 'profile'
        />
        {role === 'admin' &&(
            <Link to='/admin/dashboard'>BACK TO PAGE </Link>
        )}

        {role === 'borrower' &&(
            <Link to='/borrower/dashboard'>BACK TO PAGE</Link>
        )}
        <h1>PASSWORD CHANGING PAGE</h1>
        <form onSubmit={handleChangePassword}>
            <input type='password' placeholder='PLEASE ENTER YOU OLD PASSWORD' onChange={(e)=>setOldPassword(e.target.value)} required/>
            <input type='password' placeholder='PLEASE ENTER YOUR NEW PASSWORD' onChange={(e)=>setNewPassword(e.target.value)} required/>
            <input type='password' placeholder='CONFIRM YOUR NEW PASSWORD' onChange={(e)=>confirmSetPassword(e.target.value) } required/>
            <button type='submit'>Change</button>
        </form>
    </div>
  )
}

export default ChangePassword
