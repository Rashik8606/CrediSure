import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import '../css/loanRequestForm.css'

const LoanRequestForm = () => {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [email, setEmail] = useState('')
  const [duration, setDuration] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/loans/borrower/active_loan/')
      .then(res => {
        if (res.data.has_active_loan) navigate('/borrower/dashboard')
        else setLoading(false)
      })
      .catch(err => {
        if (err.response.status === 401) navigate('/unauthorized')
        else setLoading(false)
      })
  }, [navigate])

  const submitloan = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/loans/', {
        amount: Number(amount),
        purpose,
        email,
        duration_months: Number(duration),
      })
      const loanId = res.data.id
      alert('Loan Created. Please Upload KYC')
      navigate('/kyc-verification', { state: { loanId } })
    } catch (err) {
      console.log(err.response || err)
      setError(err.response?.data?.detail || 'Failed to submit loan application')
    }
  }

  if (loading) {
    return (
      <div className="loan-loading-wrap">
        <div className="loan-spinner" />
      </div>
    )
  }

  return (
    <div className="loan-page">
      <div className="loan-card">

        {/* Header */}
        <div className="loan-header">
          <div className="loan-icon-wrap">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                fill="#C9A84C"
              />
            </svg>
          </div>
          <h2 className="loan-title">Loan Application</h2>
          <p className="loan-subtitle">Fill in the details below to apply for a loan</p>
        </div>

        {/* Form */}
        <form onSubmit={submitloan} className="loan-form">
          {error && (
            <div className="loan-error-box">
              <span className="loan-error-icon">⚠</span> {error}
            </div>
          )}

          <div className="loan-row">
            <div className="loan-field-group">
              <label className="loan-label">Loan Amount (₹)</label>
              <div className="loan-input-wrap">
                <span className="loan-input-prefix">₹</span>
                <input
                  className="loan-input"
                  placeholder="e.g. 50000"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="loan-field-group">
              <label className="loan-label">Duration (Months)</label>
              <div className="loan-input-wrap">
                <span className="loan-input-prefix">📅</span>
                <input
                  className="loan-input"
                  placeholder="e.g. 12"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="loan-field-group">
            <label className="loan-label">Email Address</label>
            <div className="loan-input-wrap">
              <span className="loan-input-prefix">✉</span>
              <input
                className="loan-input"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="loan-field-group">
            <label className="loan-label">Purpose of Loan</label>
            <div className="loan-input-wrap">
              <span className="loan-input-prefix">📝</span>
              <input
                className="loan-input"
                placeholder="e.g. Home renovation, Education..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="loan-submit-btn">
            Proceed to KYC Verification →
          </button>
        </form>

        <div className="loan-footer">
          <Link to="/borrower/dashboard" className="loan-back-link">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoanRequestForm