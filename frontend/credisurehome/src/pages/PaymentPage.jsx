import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import '../css/payment-page.css'


/* ── LOCK ICON ── */
const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)


const PaymentPage = () => {
  const [nextEmi, setNextEmi]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [processing, setProcessing] = useState(false)
  const [mounted, setMounted]     = useState(false)

  // DARK MODE SYSTEM
  const [darkMode, setDarkMode] = useState(()=>{
    const saved = localStorage.getItem('bp-theme')
    return saved ? saved === 'dark': true
  })
  useEffect(()=>{
    const onStorage = (e)=> {
      if (e.key === 'bp-theme'){
        setDarkMode(e.newValue === 'dark')
      }
    }
    window.addEventListener('storage', onStorage)
    return ()=> window.removeEventListener('storage',onStorage)
  })


  /* ── FETCH NEXT EMI ── */
  useEffect(() => {
    API.get('/loans/next-emi/')
      .then((res) => {
        setNextEmi(res.data)
        setLoading(false)
        setTimeout(() => setMounted(true), 50)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
        setTimeout(() => setMounted(true), 50)
      })
  }, [])

  /* ── PAY NOW ── */
  const payNow = async () => {
    setProcessing(true)
    try {
      const res = await API.post('/payments/emi/create-payment/', {
        emi_id: nextEmi.emi_id,
      })

      const option = {
        key:         res.data.key,
        amount:      res.data.amount,
        currency:    'INR',
        order_id:    res.data.order_id,
        name:        'Loan EMI Payment',
        description: 'EMI Repayment',
        handler: async (response) => {
          await API.post('/emi/verify-payment/', {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          })
          alert('EMI Paid Successfully!')
          window.location.reload()
        },
      }

      const rzp = new window.Razorpay(option)
      rzp.on('payment.failed', () => setProcessing(false))
      rzp.open()
    } catch (err) {
      alert('Payment failed. Please try again.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  /* ── HELPERS ── */
  const fmtAmount = (v) =>
    v ? Number(v).toLocaleString('en-IN') : '0'

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
        })
      : '—'
   
  const theme = darkMode ? 'dark':'light'   
  
  
  /* ── LOADING STATE ── */
  if (loading) {
    return (
      <div className={`pp-loading-wrap ${theme}`}>
        <div className="pp-loading-card">
          <div className="pp-spinner" />
          <p className="pp-loading-text">Checking EMI Details…</p>
          <p className="pp-loading-subtext">Fetching your next payment</p>
        </div>
      </div>
    )
  }

  /* ── NO PENDING EMI ── */
  if (!nextEmi || !nextEmi.has_emi) {
    return (
      <div className={`payment-page ${theme}`}>
        <div className={`pp-container ${mounted ? 'mounted' : ''}`}>
          <div className="pp-empty-state">
            <div className="pp-empty-icon">🎉</div>
            <p className="pp-empty-text">No Pending EMIs</p>
            <p className="pp-empty-subtext">All payments are up to date</p>
            <Link to="/borrower/dashboard" className="pp-empty-btn">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── MAIN PAYMENT VIEW ── */
  return (
    <div className={`payment-page ${theme}`}>
      <div className={`pp-container ${mounted ? 'mounted' : ''}`}>

        {/* ── HEADER ── */}
        <div className="pp-header">
          <div className="pp-logo-wrap">
            <div className="pp-logo-icon">💳</div>
            <div>
              <h1 className="pp-title">Payment Gateway</h1>
              <p className="pp-subtitle">Secure EMI repayment</p>
            </div>
          </div>
          <Link to="/borrower/dashboard" className="pp-back-link">
            ← Dashboard
          </Link>
        </div>

        <div className="pp-divider" />

        {/* ── PAYMENT CARD ── */}
        <div className="pp-fade-up">
          <p className="pp-section-label">💸 Next EMI Due</p>

          <div className="pp-card">

            {/* Processing overlay */}
            {processing && (
              <div className="pp-overlay">
                <div className="pp-spinner" />
                <p className="pp-overlay-text">Opening Razorpay…</p>
                <p className="pp-overlay-sub">Do not close this window</p>
              </div>
            )}

            <div className="pp-card-top-bar" />
            <div className="pp-card-body">

              {/* Card header */}
              <div className="pp-card-header">
                <div>
                  <h2 className="pp-loan-title">EMI Repayment</h2>
                  <p className="pp-loan-subtitle">Review details before paying</p>
                </div>
                <div className="pp-secure-badge">
                  <span className="pp-secure-dot" />
                  Secure
                </div>
              </div>

              {/* Stats row */}
              <div className="pp-loan-stats">
                <div className="pp-stat-box">
                  <p className="pp-stat-label">EMI Month</p>
                  <p className="pp-stat-value">{nextEmi.month || '—'}</p>
                </div>
                <div className="pp-stat-divider" />
                <div className="pp-stat-box">
                  <p className="pp-stat-label">Due Date</p>
                  <p className="pp-stat-value">{fmtDate(nextEmi.due_date)}</p>
                </div>
                <div className="pp-stat-divider" />
                <div className="pp-stat-box">
                  <p className="pp-stat-label">Method</p>
                  <p className="pp-stat-value">Razorpay</p>
                </div>
              </div>

              {/* Amount highlight */}
              <div className="pp-amount-box">
                <div>
                  <p className="pp-amount-label">Total Due</p>
                  <p className="pp-amount-value">
                    <span className="pp-amount-currency">₹</span>
                    {fmtAmount(nextEmi.amount)}
                  </p>
                </div>
                <div className="pp-ssl-tag">
                  <span className="pp-ssl-text">256-bit SSL</span>
                  <div className="pp-ssl-bar" />
                </div>
              </div>

              {/* Info notice */}
              <div className={`pp-info-box ${theme}`}>
                <span className="pp-info-icon">🔒</span>
                <span className="pp-info-text">
                  Your payment is encrypted and processed securely via Razorpay.
                  This transaction is protected by 256-bit SSL.
                </span>
              </div>

              {/* CTA */}
              <button
                className="pp-pay-btn"
                onClick={payNow}
                disabled={processing}
              >
                <LockIcon />
                Pay ₹{fmtAmount(nextEmi.amount)} Now
              </button>

              <p className="pp-card-footer">
                🔐 Encrypted · Secured by Razorpay
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default PaymentPage