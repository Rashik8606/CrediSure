  import React, { useEffect, useState } from 'react'
  import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

  const BorrowerPage = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [loanInfo, setLoanInfo] = useState(null)

    useEffect(()=>{
      API.get('/loans/borrower/active_loan/')
      .then(res =>{
        setLoanInfo(res.data)
        setLoading(false)
      })
      .catch(err => {
        if (err.response?.status === 401){
          localStorage.removeItem('access_token')
          navigate('/unauthorized')
        }else {
          setLoading(false)
        }
      })
        
    },[])
    if (loading){
      return <p>Checking Eligibility...</p>
    }

    return (
      <div>
        <h2>WELCOME TO Borrower Page</h2>
        <a href='/login'>BACK TO LOGIN</a><br/>
        <a href='/change-password'>CHANGE THE PASSWORD</a><br/>

        {loanInfo && loanInfo.has_active_loan ? (
          <div style={{color:'orange'}}>
          <h3>Your loan is under process</h3>
          <p>Status : <b>{loanInfo.status}</b></p>
          <p>Amount : {loanInfo.amount}</p>
          
      </div>
        ): loanInfo ? (
          <a href='/loan-request-form'>LOAN APPLICATION FORM</a>
        ): null}
      
        
      </div>
    )
  }

  export default BorrowerPage
