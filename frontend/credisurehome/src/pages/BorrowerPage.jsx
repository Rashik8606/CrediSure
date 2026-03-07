import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import '../css/borrower-dashboard.css'
import PageFooter from './PageFooter'
import BorrowerNavBar from './BorrowerNavBar'
import Carousel from './Carousel'

/* ── STATUS COLOR HELPER ── */
const getStatusClass = (status) => {
  if (!status) return 'default'
  const s = status.toLowerCase()
  if (s.includes('approv')) return 'approved'
  if (s.includes('reject')) return 'rejected'
  if (s.includes('pend')) return 'pending'
  return 'default'
}

const BorrowerPage = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [loanInfo, setLoanInfo] = useState(null)
  const [mounted, setMounted] = useState(false)

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('bp-theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    localStorage.setItem('bp-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    API.get('/loans/borrower/active_loan/')
      .then((res) => {
        setLoanInfo(res.data)
        setLoading(false)
        setTimeout(() => setMounted(true), 50)
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token')
          navigate('/unauthorized')
        } else {
          setLoading(false)
          setTimeout(() => setMounted(true), 50)
        }
      })
  }, [navigate])

  if (loading) {
    return (
      <div className={`bp-loading-wrap ${darkMode ? 'dark' : 'light'}`}>
        <div className="bp-loading-card">
          <div className="bp-spinner" />
          <p className="bp-loading-text">Checking Eligibility…</p>
          <p className="bp-loading-subtext">Fetching your loan status</p>
        </div>
      </div>
    )
  }

  const hasActiveLoan = loanInfo?.has_active_loan
  const isApprovedLoan = loanInfo?.approved_loan
  const statusClass = getStatusClass(loanInfo?.status)

  return (
    <div className={`borrower-page ${darkMode ? 'dark' : 'light'}`}>

      {/* ── NAVBAR — passes hasActiveLoan for Apply guard ── */}
      <BorrowerNavBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        hasActiveLoan={hasActiveLoan}
      />

      {/* ── CAROUSEL ── */}
      <div className="bp-carousel-full">
        <Carousel autoplay autoplayDelay={3500} pauseOnHover loop />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className={`bp-container ${mounted ? 'mounted' : ''}`}>

        {/* ── PORTAL HEADER ── */}
        <div className="bp-portal-header">
          <div className="bp-logo-wrap">
            <div className="bp-logo-icon">💳</div>
            <div>
              <h1 className="bp-title">Borrower Portal</h1>
              <p className="bp-subtitle">Your personal loan dashboard</p>
            </div>
          </div>
        </div>

        <div className="bp-divider" />

        {/* ── LOAN DETAILS ── */}
        {hasActiveLoan && !isApprovedLoan ? (

          <div className="bp-fade-up">
            <p className="bp-section-label">📋 Active Loan</p>
            <div className="bp-active-card">
              <div className="bp-active-card-top-bar" />
              <div className="bp-active-card-body">
                <div className="bp-active-card-header">
                  <div>
                    <h2 className="bp-loan-title">Loan Under Process</h2>
                    <p className="bp-loan-subtitle">Your application is being reviewed</p>
                  </div>
                  <div className={`bp-status-badge ${statusClass}`}>
                    <span className={`bp-status-dot ${statusClass}`} />
                    {loanInfo.status}
                  </div>
                </div>
                <div className="bp-loan-stats">
                  <div className="bp-stat-box">
                    <p className="bp-stat-label">Loan Amount</p>
                    <p className="bp-stat-value">₹{Number(loanInfo.amount).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bp-stat-divider" />
                  <div className="bp-stat-box">
                    <p className="bp-stat-label">Status</p>
                    <p className={`bp-stat-value ${statusClass}`}>{loanInfo.status}</p>
                  </div>
                </div>
                <div className="bp-info-box">
                  <span className="bp-info-icon">ℹ️</span>
                  <span className="bp-info-text">
                    Our team is reviewing your application. You will be notified once a decision is made.
                  </span>
                </div>
              </div>
            </div>
          </div>

        ) : isApprovedLoan ? (

          <div className="bp-fade-up">
            <p className="bp-section-label">✅ Approved Loan</p>
            <div className="bp-active-card approved">
              <div className="bp-active-card-top-bar approved" />
              <div className="bp-active-card-body">
                <h2 className="bp-loan-title">Loan Approved 🎉</h2>
                <p className="bp-loan-subtitle">Congratulations! Your loan has been approved.</p>
                <div className="bp-loan-stats">
                  <div className="bp-stat-box">
                    <p className="bp-stat-label">Approved Amount</p>
                    <p className="bp-stat-value approved">₹{Number(loanInfo.amount).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bp-stat-divider" />
                  <div className="bp-stat-box">
                    <p className="bp-stat-label">Loan Type</p>
                    <a href='/payments' className="bp-repay-link">REPAY →</a>
                    <p className="bp-stat-value">{loanInfo.loan_type || 'Standard'}</p>
                  </div>
                </div>
                <div className="bp-info-box success">
                  <span className="bp-info-icon">✅</span>
                  <span className="bp-info-text">Our team will contact you for disbursement details.</span>
                </div>
              </div>
            </div>
          </div>

        ) : loanInfo ? (

          <div className="bp-fade-up">
            <p className="bp-section-label">🚀 Get Started</p>
            <div className="bp-apply-card">
              <h2>No Active Loan</h2>
              <p>You are eligible to apply for a loan.</p>
              <a href="/loan-request-form" className="bp-apply-btn">Apply for Loan →</a>
            </div>
          </div>

        ) : (

          <div className="bp-empty-state">
            <div className="bp-empty-icon">📭</div>
            <p className="bp-empty-text">No loan information available</p>
            <p className="bp-empty-subtext">Please contact support if this seems incorrect.</p>
          </div>
        )}

      </div>

      <PageFooter darkMode={darkMode} />

    </div>
  )
}

export default BorrowerPage