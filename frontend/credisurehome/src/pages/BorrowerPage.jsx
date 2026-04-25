import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import '../css/borrower-dashboard.css'
import PageFooter from './PageFooter'
import BorrowerNavBar from './BorrowerNavBar'
import Carousel from './Carousel'
import ServiceSection from './ServiceCard'
import StatsSection from './StatsSection'

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

  const toggleTheme = () => {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('bp-theme', next ? 'dark' : 'light')
  }

  useEffect(() => {
    API.get('/loans/borrower/active_loan/')
      .then((res) => {
        console.log('API RESPONSE:', res.data) // ✅ DEBUG

        setLoanInfo(res.data || null)
        setLoading(false)
        setTimeout(() => setMounted(true), 50)
      })
      .catch((err) => {
        console.error(err)

        if (err.response?.status === 401) {
          localStorage.removeItem('access') // ✅ FIXED
          navigate('/unauthorized')
        } else {
          setLoanInfo(null)
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

      {/* NAVBAR */}
      <BorrowerNavBar
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        hasActiveLoan={hasActiveLoan}
        activePage='dashboard'
      />

      {/* CAROUSEL */}
      <div className="bp-carousel-full">
        <Carousel autoplay autoplayDelay={3500} pauseOnHover loop />
      </div>

      {/* MAIN */}
      <div className={`bp-container ${mounted ? 'mounted' : ''}`}>

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

        {/* ✅ MAIN LOGIC FIXED */}

        {!loanInfo ? (

          <div className="bp-empty-state">
            <div className="bp-empty-icon">📭</div>
            <p className="bp-empty-text">No loan data found</p>
            <p className="bp-empty-subtext">Please contact support.</p>
          </div>

        ) : !hasActiveLoan ? (

          <div className="bp-fade-up">
            <p className="bp-section-label">🎉 All Loans Cleared</p>
            <div className="bp-apply-card">
              <h2>No Pending EMI</h2>
              <p>Your loan is fully paid. You can apply for a new loan.</p>
              <a href="/loan-request-form" className="bp-apply-btn">
                Apply for Loan →
              </a>
            </div>
          </div>

        ) : hasActiveLoan && !isApprovedLoan ? (

          <div className="bp-fade-up">
            <p className="bp-section-label">📋 Active Loan</p>
            <div className="bp-active-card">
              <div className="bp-active-card-top-bar" />
              <div className="bp-active-card-body">
                <h2 className="bp-loan-title">Loan Under Process</h2>
                <p className="bp-loan-subtitle">Your application is being reviewed</p>

                <div className={`bp-status-badge ${statusClass}`}>
                  {loanInfo.status}
                </div>
              </div>
            </div>
          </div>

        ) : isApprovedLoan ? (

          <div className="bp-fade-up">
            <p className="bp-section-label">✅ Approved Loan</p>
            <div className="bp-active-card approved">
              <div className="bp-active-card-body">
                <h2 className="bp-loan-title">Loan Approved 🎉</h2>

                <p className="bp-loan-subtitle">
                  You can now proceed with EMI payment
                </p>

                <a href="/payments" className="bp-repay-link">
                  Go to Payment →
                </a>
              </div>
            </div>
          </div>

        ) : (

          <div className="bp-empty-state">
            <div className="bp-empty-icon">⚠️</div>
            <p className="bp-empty-text">Unexpected state</p>
          </div>

        )}

      </div>

      <ServiceSection />
      <StatsSection darkMode={darkMode} />
      <PageFooter darkMode={darkMode} />

    </div>
  )
}

export default BorrowerPage