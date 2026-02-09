import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios';

const LoanRequestForm = () => {
    const navigate = useNavigate();

    const [amount, setAmount] = useState('')
    const [purpose, setPurpose] = useState('')
    const [duration, setDuration] = useState('')
    const [error, setError] = useState('')


    const submitloan = async (e)=>{
        e.preventDefault();

        try{
        const res =  await API.post('/loan/',{
            amount,
            purpose,
            duration_months:duration
        })

        alert('Loan Created.Please Upload KYC')
        navigate('/')
    }catch{
        setError('Failed to submit loan application')
    }
    }

  return (
    <div>
      <h2>LOAN REQUEST FORM</h2>

      <form onSubmit={submitloan}>
        {error && <p>{error}</p>}

        <input placeholder='AMOUNT' onChange={(e)=> setAmount(e.target.value)}/>
        <input placeholder='PURPOSE' onChange={(e)=> setPurpose(e.target.value)}/>
        <input placeholder='DURATION' onChange={(e)=>setDuration(e.target.value)}/>

        <button type='submit'>GO TO KYC</button>
      </form>
    </div>
  )
}

export default LoanRequestForm
