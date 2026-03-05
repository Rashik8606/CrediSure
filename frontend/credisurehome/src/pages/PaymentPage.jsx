import React, { useEffect, useState } from 'react'
import API from '../api/axios'
import { Link } from 'react-router-dom'


const PaymentPage = () => {
  const [nextEmi, setNextEmi] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(()=>{
    API.get('/loans/next-emi/')
    .then(res=>{
      setNextEmi(res.data)
      setLoading(false)
    })
    .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const payNow = async()=>{
    try{
      const res = await API.post('/emi/create-payment/',{
        emi_id : nextEmi.emi_id
      })
      const option  = {
        key : res.data.key,
        amount : res.data.amount,
        currency : 'INR',
        order_id : res.data.order_id,
        name : 'Loan EMI Payment',
        description : 'EMI Repayment',
        handler : async (response)=>{
          await API.post('/emi/verify-payment/',{
            razorpay_order_id:response.razorpay_order_id,
            razorpay_payment_id :response.razorpay_payment_id,
            razorpay_signature : response.razorpay_signature
          })
          alert('EMI Paid Successfully completed')
          window.location.reload()
        }
      }
      const rzp = new window.Razorpay(option)
      rzp.open()
    }catch(err){
      alert('Payment Failed..')
      console.error(err);
      
    }
  }
  if (loading){
    return <h2>Loading EMI Details..</h2>
  }
  if (!nextEmi || !nextEmi.has_emi){
    return (
      <div>
        <Link to='/borrower/dashboard'>Back To Page </Link>
        <h2>Payment Gateway </h2>
        <p>No Pending EMIs</p>
      </div>
    )
  }
  return (
    <div>
      <h2>Payment Gateway</h2>
      <div>
        <p><b>EMI Month : </b> {nextEmi.month}</p>
        <p><b>Amount : </b>{nextEmi.amount}</p>
        <p><b>Due Date :</b>{nextEmi.due_date}</p>
        <button onClick={payNow}>Pay Now</button>
      </div>
      <Link>Back To Home</Link>
    </div>
  )
}

export default PaymentPage
