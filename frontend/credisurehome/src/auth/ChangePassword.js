import React, { useState } from 'react'
import API from '../api/axios';
import { Link } from 'react-router-dom';
import { getUserRole } from '../utils/auth';

const ChangePassword = () => {

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, confirmSetPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const role = getUserRole()

    const handleChangePassword = async(e)=>{
        e.preventDefault();
        setMessage('')
        setError('')

        try{
            const response = await API.put('/change-password',{
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
        {role === 'admin' &&(
            <Link to='/admin/dashboard'>BACK TO PAGE </Link>
        )}

        {role === 'borrower' &&(
            <Link to='/borrower/dashboard'>BACK TO PAGE</Link>
        )}
        <h1>PASSWORD CHANGING PAGE</h1>
        <form></form>
    </div>
  )
}

export default ChangePassword
