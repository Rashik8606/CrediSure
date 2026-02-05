import { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from 'react-router-dom'


function Login() {
    const navigate = useNavigate();

    const [ role, setRole ] = useState('borrower')
    const [ username, setUserName ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ secretKey, setSecretKey ] = useState('')
    const [ error, setError ] = useState('')


    const handleLogin = async (e) =>{
        e.preventDefault();

        if (role === 'admin' && secretKey.trim()){
            alert('Please Enter Your Secret Key ...')
            return;
        }

        try{
            const payload = {
                username,
                password,
            }
            if (role === 'admin'){
                payload.secret_key = secretKey
            }

            const res = await API.post('token/',payload)

            const backendRole = res.data.role;

            if(backendRole !== role){
                alert(
                    backendRole ==='admin'
                    ?'You Are an admin..! Please Select Admin and enter your secret key '
                    :'You Are a Borrower..! Please Select Borrower. You Can not Vist Admin page'
                )
                return
            }

            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token',res.data.refresh);
            localStorage.setItem('role',backendRole)

            if ( backendRole === 'admin'){
                navigate('/admin/dashboard');
            }else{
                navigate('/borrower/dashboard')
            }
        }catch (err){
            console.log(err.response?.data)
            setError(err.response?.data.error ||
                err.response?.data.detail||
                'Invalid credentials or secret key')
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <h2>Login Page</h2>
                {error && <p style={{color:'red'}}>{error}</p>}
                {/* ROLE SELECT */}

                <select value={role} onChange={(e)=> setRole(e.target.value)}>
                    <option value='borrower'>Borrower</option>
                    <option value='admin'>Admin</option>
                </select>

                <input type="text" placeholder="ENTER EMAIL.." onChange={(e)=> setUserName(e.target.value)} required/>

                <input type="password" placeholder="ENTER PASSWORD" onChange={(e)=> setPassword(e.target.value)} required/>

                {role === 'admin' && (
                    <input type="password" placeholder="ENTER SECRECT KEY" onChange={(e)=> setSecretKey(e.target.value)} required/>
                )}

                <button type="submit">Login</button>
            </form>

            <Link to='/register'>Register Page</Link>
        </div>
    )
}

export default Login;

