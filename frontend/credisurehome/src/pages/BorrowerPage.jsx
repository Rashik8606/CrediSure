import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import '../css/borrower-dashboard.css'

const getStatusClass = (status) => {
  if (!status) return 'default'
  const s = status.toLowerCase()
  if (s.includes('approv')) return 'approved'
  if (s.includes('reject')) return 'rejected'
  if (s.includes('pend'))   return 'pending'
  return 'default'
}

const BorrowerPage = () => {
  const navigate  = useNavigate()
  const [loading,  setLoading]  = useState(true)
  const [loanInfo, setLoanInfo] = useState(null)
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => {
    API.get('/loans/borrower/active_loan/')
      .then(res => {
        setLoanInfo(res.data)
        setLoading(false)
        setTimeout(() => setMounted(true), 50)
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token')
          navigate('/unauthorized')
        } else {
          setLoading(false)
          setTimeout(() => setMounted(true), 50)
        }
      })
  }, [])

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="bp-loading-wrap">
        <div className="bp-loading-card">
          <div className="bp-spinner" />
          <p className="bp-loading-text">Checking Eligibility…</p>
          <p className="bp-loading-subtext">Fetching your loan status</p>
        </div>
      </div>
    )
  }

  const hasActiveLoan = loanInfo && loanInfo.has_active_loan
  const isApprovedLoan = loanInfo && loanInfo.approved_loan
  const statusClass   = loanInfo ? getStatusClass(loanInfo.status) : 'default'

  return (
    <>
      {/* <PageNavBar /> */}

      <div className="borrower-page">
        <div className={`bp-container ${mounted ? 'mounted' : ''}`}>

          {/* ── HEADER ── */}
          <div className="bp-header">
            <div className="bp-logo-wrap">
              <div className="bp-logo-icon">💳</div>
              <div>
                <h1 className="bp-title">Borrower Portal</h1>
                <p className="bp-subtitle">Your personal loan dashboard</p>
              </div>
            </div>
            <div className="bp-header-links">
              <a href="/change-password" className="bp-link-pw">🔑 Change Password</a>
              <a href="/login"           className="bp-link-login">← Back to Login</a>
            </div>
          </div>

          <div className="bp-divider" />

          {/* ── ACTIVE LOAN ── */}
          {hasActiveLoan ?  (
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
                      <p className="bp-stat-value">
                        ₹{Number(loanInfo.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bp-stat-divider" />
                    <div className="bp-stat-box">
                      <p className="bp-stat-label">Status</p>
                      <p className={`bp-stat-value ${statusClass}`}>{loanInfo.status}</p>
                    </div>
                    <div className="bp-stat-divider" />
                    <div className="bp-stat-box">
                      <p className="bp-stat-label">Loan Type</p>
                      <p className="bp-stat-value">{loanInfo.loan_type || 'Standard'}</p>
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

          ) : loanInfo ? (

            /* ── APPLY FOR LOAN ── */
            <div className="bp-fade-up">
              <p className="bp-section-label">🚀 Get Started</p>

              <div className="bp-apply-card">
                <div className="bp-apply-illustration">
                  <div className="bp-apply-icon-big">🏦</div>
                  <div className="bp-apply-glow-ring" />
                </div>

                <div className="bp-apply-content">
                  <h2 className="bp-apply-title">No Active Loan</h2>
                  <p className="bp-apply-desc">
                    You are eligible to apply for a loan. Start your application and get a decision within 24 hours.
                  </p>

                  <div className="bp-feature-list">
                    {['Quick approval process', 'Competitive interest rates', 'Flexible repayment plans'].map((f, i) => (
                      <div key={i} className="bp-feature-item">
                        <span className="bp-feature-check">✓</span>
                        <span className="bp-feature-text">{f}</span>
                      </div>
                    ))}
                  </div>

                  <a href="/loan-request-form" className="bp-apply-btn">
                    Apply for Loan →
                  </a>
                </div>
              </div>
            </div>

          ) : (

            /* ── EMPTY STATE ── */
            <div className="bp-empty-state">
              <div className="bp-empty-icon">📭</div>
              <p className="bp-empty-text">No loan information available</p>
              <p className="bp-empty-subtext">Please contact support if this seems incorrect.</p>
            </div>

          )}

        </div>
      </div>
    </>
  )
}

export default BorrowerPage