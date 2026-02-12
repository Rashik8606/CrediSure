import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios';

const LoanRequestForm = () => {
    const navigate = useNavigate();

    const [amount, setAmount] = useState('')
    const [purpose, setPurpose] = useState('')
    const [email, setEmail] = useState('')
    const [duration, setDuration] = useState('')
    const [error, setError] = useState('')


    const submitloan = async (e)=>{
        e.preventDefault();

        try{
        const res =  await API.post('/loans/',{
            amount : Number(amount),  //if not here Number Default str but Number key word helps Change to Integer 
            purpose,
            email,
            duration_months:Number(duration)
        })

        const loanId = res.data.id
        alert('Loan Created.Please Upload KYC')
        console.log('loanId from navigation:', loanId)

        navigate('/kyc-verification',{
          state:{loanId}
        })
    }catch(err){
      console.log(err.response || err)
      setError(err.response?.data?.message ||'Failed to submit loan application')
    }
    }

  return (
    <div>
      <h2>LOAN REQUEST FORM</h2>

      <form onSubmit={submitloan}>
        {error && <p>{error}</p>}

        <input placeholder='AMOUNT' onChange={(e)=> setAmount(e.target.value)}/>
        <input placeholder='PURPOSE' onChange={(e)=> setPurpose(e.target.value)}/>
        <input placeholder='EMAIL' onChange={(e) => setEmail(e.target.value)}/>
        <input placeholder='DURATION' onChange={(e)=>setDuration(e.target.value)}/>
        <button type='submit'>GO TO KYC</button>
      </form>
      <Link to='/'>BACK</Link>
    </div>
  )
}

export default LoanRequestForm
