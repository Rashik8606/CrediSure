import React, { useEffect, useState } from 'react'
import API from '../api/user-service_axios';
import { Link } from 'react-router-dom';
import { getUserRole } from '../utils/auth';
import BorrowerNavBar from '../pages/BorrowerNavBar';
import '../css/password_profile.css'

const ChangePassword = () => {

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, confirmSetPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const [profile, setProfile ] = useState(null)
    const [activeTab, setActiveTab] = useState('profile')

    useEffect(()=>{
        const fetchDetails = async () =>{
            try {
            const res = await API.get('/profile')
            setProfile(res.data)
        }catch (err){
            console.error('Failed to fetch Profile :',err)
        }
    }
        fetchDetails()
    },[])

    const [darkMode, setDarkMode] = useState(()=>{
        const saved = localStorage.getItem('bp-theme')
        return saved ? saved === 'dark':'light'
    })

    const toggleTheme = () =>{
        const next = !darkMode
        setDarkMode(next)
        localStorage.setItem('bp-theme', next? 'dark':'light')
    }

    const theme = darkMode ? 'dark':'light'

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
        <>
        <BorrowerNavBar
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        activePage = 'profile'
        />
        <div className={`cp-container ${theme}`}>
        {role === 'admin' &&(
            <Link className='cp-back-link' to='/admin/dashboard'>BACK TO PAGE </Link>
        )}

        {role === 'borrower' &&(
            <Link className='cp-back-link' to='/borrower/dashboard'>BACK TO PAGE</Link>
        )}

        <div className='cp-tabs'>
            <button onClick={()=> setActiveTab('profile')} className={activeTab === 'proile'? 'active':''}>Profile</button>
            <button onClick={()=> setActiveTab('password')} className={activeTab === 'password'?'active':''}>Password Change</button>
        </div>
        {activeTab === 'profile' && (
            <div className='cp-card cp-profile-card'>
                <div className='cp-avatar'>👤</div>
                <h2 className='cp-profile-name'>{profile?.username}</h2>
                <p className='cp-profile-role'>{role}</p>
                <div className='cp-profile-details'>
                    <div className='cp-profile-row'>
                        <span className='cp-detail-label'>Email</span>
                        <span className='cp-detail-value'>: {profile?.email}</span>
                    </div>
                    <div className='cp-detail-row'>
                        <span className='cp-detail-label'>Phone</span>
                        <span className='cp-detail-value'>: {profile?.phone}</span>
                    </div>
                    <div className='cp-profile-row'>
                        <span className='cp-detail-label'>Member Since</span>
                        <span className='cp-detail-value'>: {profile?.created_at}</span>
                    </div>
                </div>
            </div>
        )}
        <div className='cp-page-layout'>
            

        {activeTab === 'password' && (
            <div className='cp-card'>
        <h1 className='cp-title'>PASSWORD CHANGING PAGE</h1>
        <form onSubmit={handleChangePassword} className='cp-form'>
            <input className='cp-input' type='password' placeholder='PLEASE ENTER YOU OLD PASSWORD' onChange={(e)=>setOldPassword(e.target.value)} required/>
            <input className='cp-input' type='password' placeholder='PLEASE ENTER YOUR NEW PASSWORD' onChange={(e)=>setNewPassword(e.target.value)} required/>
            <input className='cp-input' type='password' placeholder='CONFIRM YOUR NEW PASSWORD' onChange={(e)=>confirmSetPassword(e.target.value) } required/>
            <button className='cp-btn' type='submit'>Change</button>
        </form>
        </div>

        )}
        
        </div>
        {message && <p className='cp-message'>{message}</p>}
        {error && <p className='cp-error'>{error}</p>}
    </div>
    </>
  )
}

export default ChangePassword
