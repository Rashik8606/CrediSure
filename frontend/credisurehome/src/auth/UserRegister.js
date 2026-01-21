import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";


function UserRegister() {
    const navigate = useNavigate()

    const [role, setRole] = useState('borrower')
    const [username, setUserName ] = useState('')
    const [email, setEmail ] = useState('')
    const [password, setPassword ] = useState('')
    const [number, setNumber ] = useState('')
    const [error, setError ] = useState('')


    const handleRegister = async (e) =>{
        e.preventDefault();
        
        try {
            const response = await API.post('/register/',{
                username,
                email,
                password,
                role,
                phone_number : number
            })

            const {access, refresh} = response.data;


            localStorage.getItem('access_token',access)
            localStorage.getItem('refresh_token',refresh)


            navigate('/dash-board');
        }catch(err){
            setError(err.response?.data?.message || 'Register Failed !')
        }
    };
    return (
        <div>
            <form onSubmit={handleRegister}>
                <h2>User Register</h2>
                {error && <p style={{color:'red'}}>{error}</p>}

                <input type="text" placeholder="User Name" onChange={(e) => setUserName(e.target.value)} required/>

                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>

                <input type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} required/>

                <input type="number" placeholder="Enter Your Number" onChange={(e)=> setNumber(e.target.value)} required/>

                <section onChange={(e) => setRole(e.target.value)}>
                    <option value='borrower'>BORROWER</option>
                    <option value='admin'>ADMIN</option>
                </section>

                <button type="submit">REGISTER</button>
            </form>
            <a href="/login">Login Page</a>
        </div>
    );

    }


export default UserRegister;