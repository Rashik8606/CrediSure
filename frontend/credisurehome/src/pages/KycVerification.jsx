import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../api/axios'

const KycVerification = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const {loanId} = location.state || {}

    const [selfie, setSelfie] = useState('')
    const [aadhaarNumber, setAadhaarNumber] = useState('')
    const [aadhaarFront, setAadhaarFront] = useState(null)
    const [aadhaarBack, setAadhaarBack] = useState(null)
    const [panNumber, setPanNumber] = useState('')
    const [panCard, setPanCard] = useState(null)
    const [error, setError] = useState('')

    if (!loanId){
      return <p>Please Apply for a loan before uploading KYC</p>
    }

    const loansubmit = async (e)=>{
        e.preventDefault();
        setError('')

        try{

          const formData = new FormData()
          formData.append('selfie',selfie)
          formData.append('aadhaar_number',aadhaarNumber)
          formData.append('aadhaar_front',aadhaarFront)
          formData.append('aadhaar_back',aadhaarBack)
          formData.append('pan_number',panNumber)
          formData.append('pan_card',panCard)

          await API.post(`/loans/kyc-upload/${loanId}/`,formData)
          alert('Your Loan application Under Review. We will Update Soon')
          navigate('/borrower/dashboard')

        }catch(err){
          console.log(err.response || err)
          setError(err.response?.data?.message || 'Verification FAILED')
        }
    }
  return (
    <div>
      <h2>KYC VERIFICATION</h2>
      <form onSubmit={loansubmit}>
        {error && <p>{error}</p>}
        <input placeholder='Enter Aadhaar Number' onChange={(e)=>setAadhaarNumber(e.target.value)} required/>
        <input placeholder='PAN CARD Number' onChange={(e)=> setPanNumber(e.target.value)} required/>
        <input type='file' placeholder='Take Your Photo' accept='image/*' onChange={(e)=>setSelfie(e.target.files[0])}/>
        <input type='file' placeholder='Upload Aadhaar Front side' accept='image/*' onChange={(e)=>setAadhaarFront(e.target.files[0])}/>
        <input type='file' placeholder='Upload Aadhaar Back side' accept='image/*' onChange={(e)=>setAadhaarBack(e.target.files[0])}/>
        <input type='file' placeholder='Upload Pan Card Photo' accept='image/*' onChange={(e)=>setPanCard(e.target.files[0])}/>
        <button type='submit'>SUBMIT</button>
      </form>
    </div>
  )
}

export default KycVerification
