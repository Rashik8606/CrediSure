import React, { useState, useEffect } from 'react'
import '../css/borrowerNavBar.css'


const BorrowerNavBar = ({ darkMode, toggleTheme, hasActiveLoan, activePage }) => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)


  // const toggeleTheme = () => {
  //   const next = !darkMode
  //   setDarkMode(next)
  //   localStorage.setItem('bp-theme', next ? 'dark':'light')
  // }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Auto-hide alert after 3s
  useEffect(() => {
    if (!showAlert) return
    const t = setTimeout(() => setShowAlert(false), 3000)
    return () => clearTimeout(t)
  }, [showAlert])

  const handleApplyClick = (e) => {
    if (hasActiveLoan) {
      e.preventDefault()
      setShowAlert(true)
      setMenuOpen(false)
    }
  }

  const theme = darkMode ? 'dark' : 'light'

  return (
    <>
      {/* ── ALERT TOAST ── */}
      <div className={`bp-nav-alert ${showAlert ? 'visible' : ''} ${theme}`}>
        <span className="bp-nav-alert-icon">⚠️</span>
        <div>
          <p className="bp-nav-alert-title">Active Loan Exists</p>
          <p className="bp-nav-alert-sub">You already have an active loan. Please repay before applying again.</p>
        </div>
        <button className="bp-nav-alert-close" onClick={() => setShowAlert(false)}>✕</button>
      </div>

      <nav className={`bp-navbar ${theme} ${scrolled ? 'scrolled' : ''}`}>
        <div className="bp-navbar-inner">

          {/* ── LOGO ── */}
          <a href="/" className="bp-navbar-logo">
            <div className="bp-navbar-logo-icon">💳</div>
            <span className="bp-navbar-logo-text">{activePage === 'profile' ? 'Profile' : 'LoanPortal'}</span>
          </a>

          {/* ── DESKTOP LINKS ── */}
          <div className="bp-navbar-links">
            <a href="/borrower/dashboard" className={`bp-navbar-link ${activePage === 'dashboard'?'active':''}`}>Dashboard</a>
            <a
              href="/loan-request-form"
              className="bp-navbar-link"
              onClick={handleApplyClick}
            >
              Apply
            </a>
            <a href="/change-password" className={`bp-navbar-link ${activePage === 'profile'?'active':''}`}>Account</a>
          </div>

          {/* ── RIGHT ACTIONS ── */}
          <div className="bp-navbar-actions">
            <button
              className="bp-navbar-theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <span className="bp-navbar-theme-icon">{darkMode ? '☀️' : '🌙'}</span>
              <span className="bp-navbar-theme-label">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            <a href="/login" className="bp-navbar-logout-btn">← Logout</a>

            <button
              className={`bp-navbar-hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <div className={`bp-navbar-mobile-menu ${menuOpen ? 'open' : ''}`}>
          <a href="/borrower" className="bp-navbar-mobile-link" onClick={() => setMenuOpen(false)}>
            🏠 Dashboard
          </a>
          <a
            href="/loan-request-form"
            className="bp-navbar-mobile-link"
            onClick={handleApplyClick}
          >
            📋 Apply for Loan
            {hasActiveLoan && <span className="bp-nav-badge">Active Loan</span>}
          </a>
          <a href="/change-password" className="bp-navbar-mobile-link" onClick={() => setMenuOpen(false)}>
            🔑 Account
          </a>
          <div className="bp-navbar-mobile-divider" />
          <button
            className="bp-navbar-mobile-theme"
            onClick={() => { toggleTheme(); setMenuOpen(false) }}
          >
            {darkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
          </button>
          <a href="/login" className="bp-navbar-mobile-link logout" onClick={() => setMenuOpen(false)}>
            ← Logout
          </a>
        </div>
       
      </nav>
    </>
  )
}

export default BorrowerNavBar