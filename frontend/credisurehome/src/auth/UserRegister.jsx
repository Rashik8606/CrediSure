import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../css/login.css'

function UserRegister() {
    const navigate = useNavigate()

    const [role, setRole] = useState('borrower')
    const [username, setUserName ] = useState('')
    const [email, setEmail ] = useState('')
    const [password, setPassword ] = useState('')
    const [number, setNumber ] = useState('')
    const [error, setError ] = useState('')
    const [ secretKey, setSecretKey ] = useState('')



    const handleRegister = async (e) =>{
        e.preventDefault();
        
        try {
            const response = await API.post('/register/',{
                username,
                email,
                password,
                phone_number : number,
                secret_key : role === 'admin' ? secretKey:'',
                
            })


            const {access, refresh, role:backendRole} = response.data

            localStorage.setItem('access_token',access)
            localStorage.setItem('refresh_token',refresh)


            if (backendRole ==='admin'){
                navigate('/admin/dashboard')
            }else{
                navigate('/borrower/dashboard')
            }

        }catch(err){
            console.log(err.response?.data)
            setError(err.response?.data?.message ||
                JSON.stringify(err.response?.data) || 'Register Failed !')
        }
    };
    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleRegister}>
                <h2>User Register Portal</h2>
                
                {error && <p style={{color:'red'}}>{error}</p>}

                <label className="label">Enter Your Name</label>
                <input className="input" type="text" placeholder="User Name" onChange={(e) => setUserName(e.target.value)} required/>

                <label className="label">Email</label>
                <input className="input" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>

                <label className="label">Password</label>
                <input className="input" type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} required/>

                <label className="label">Phone Number</label>
                <input className="input" type="number" placeholder="Enter Your Number" onChange={(e)=> setNumber(e.target.value)} required/>

                <label className="label"></label>
                <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value='borrower'>BORROWER</option>
                    <option value='admin'>ADMIN</option>
                </select>

                {role ==='admin' && (
                    <>
                    <label className="label">Secret Key</label>
                    <input className="input" type="password" placeholder="ENTER SECRET KEY" onChange={(e)=>setSecretKey(e.target.value)} required></input>
                    </>
                    
                )}

                <button className="login-btn" type="submit">REGISTER</button>
                <p className="register-link">You Have an Account<br/>
                    <Link to='/login'>Login Here !</Link>
                </p>
            </form>
          
        </div>
    );

    }


export default UserRegister;