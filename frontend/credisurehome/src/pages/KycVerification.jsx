import React, { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import API from '../api/axios'
import '../css/loanKYCverificationForm.css'

const STEPS = ['Personal Info', 'Document Upload', 'Review']

const KycVerification = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const loanId = location.state?.loanId

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('bp-theme')
    return saved ? saved === 'dark' : true
  })

  const toggleTheme = () => {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('bp-theme', next ? 'dark' : 'light')
  }

  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Step 1 — Personal Info
  const [fullName, setFullName] = useState('')
  const [dob, setDob] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')

  // Step 2 — Documents
  const [docType, setDocType] = useState('aadhaar')
  const [docNumber, setDocNumber] = useState('')
  const [docFront, setDocFront] = useState(null)
  const [docBack, setDocBack] = useState(null)
  const [selfie, setSelfie] = useState(null)

  const frontRef = useRef()
  const backRef = useRef()
  const selfieRef = useRef()

  const docTypes = [
    { value: 'aadhaar', label: 'Aadhaar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'voter_id', label: 'Voter ID' },
  ]

  const handleNext = (e) => {
    e.preventDefault()
    setError('')
    if (step === 0) {
      if (!fullName || !dob || !phone || !address || !city || !pincode) {
        setError('Please fill in all personal details.')
        return
      }
    }
    if (step === 1) {
      if (!docNumber || !docFront) {
        setError('Please provide document number and front image.')
        return
      }
    }
    setStep((s) => s + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('loan_id', loanId)
      formData.append('full_name', fullName)
      formData.append('date_of_birth', dob)
      formData.append('phone', phone)
      formData.append('address', address)
      formData.append('city', city)
      formData.append('pincode', pincode)
      formData.append('document_type', docType)
      formData.append('document_number', docNumber)
      if (docFront) formData.append('aadhaar_front', docFront)
      if (docBack) formData.append('aadhaar_back', docBack)
      if (selfie) formData.append('selfie', selfie)

      await API.post(`/loans/kyc-upload/${loanId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'KYC submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const FileUploadBox = ({ label, file, inputRef, onChange, required }) => (
    <div className="kyc-upload-box" onClick={() => inputRef.current.click()}>
      <input
        type="file"
        ref={inputRef}
        accept="image/*,.pdf"
        style={{ display: 'none' }}
        onChange={(e) => onChange(e.target.files[0])}
      />
      {file ? (
        <div className="kyc-upload-preview">
          <span className="kyc-upload-check">✓</span>
          <span className="kyc-upload-filename">{file.name}</span>
          <span className="kyc-upload-change">Change</span>
        </div>
      ) : (
        <div className="kyc-upload-placeholder">
          <span className="kyc-upload-icon">↑</span>
          <span className="kyc-upload-label">{label}</span>
          {required && <span className="kyc-upload-required">Required</span>}
        </div>
      )}
    </div>
  )

  if (submitted) {
    return (
      <div className={`kyc-page ${darkMode ? 'dark' : 'light'}`}>
        <div className="kyc-card kyc-success-card">
          <div className="kyc-success-icon">✓</div>
          <h2 className="kyc-success-title">KYC Submitted!</h2>
          <p className="kyc-success-msg">
            Your documents are under review. We'll notify you once verification is complete.
          </p>
          <button className="kyc-submit-btn" onClick={() => navigate('/borrower/dashboard')}>
            Go to Dashboard →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`kyc-page ${darkMode ? 'dark' : 'light'}`}>
      <div className="kyc-card">
        <button onClick={toggleTheme} className="kyc-theme-toggle">
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        {/* Header */}
        <div className="kyc-header">
          <div className="kyc-icon-wrap">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 1C8.676 1 6 3.676 6 7v1H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V9a1 1 0 00-1-1h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 110 4 2 2 0 010-4z"
                fill="#C9A84C"
              />
            </svg>
          </div>
          <h2 className="kyc-title">KYC Verification</h2>
          <p className="kyc-subtitle">Verify your identity to complete the loan process</p>
        </div>

        {/* Stepper */}
        <div className="kyc-stepper">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`kyc-step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
                <div className="kyc-step-circle">
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="kyc-step-label">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`kyc-step-line ${i < step ? 'done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {error && (
          <div className="kyc-error-box">
            <span className="kyc-error-icon">⚠</span> {error}
          </div>
        )}

        {/* Step 0 — Personal Info */}
        {step === 0 && (
          <form onSubmit={handleNext} className="kyc-form">
            <div className="kyc-row">
              <div className="kyc-field-group">
                <label className="kyc-label">Full Name</label>
                <div className="kyc-input-wrap">
                  <span className="kyc-input-prefix">👤</span>
                  <input className="kyc-input" placeholder="As on official ID" value={fullName}
                    onChange={(e) => setFullName(e.target.value)} required />
                </div>
              </div>
              <div className="kyc-field-group">
                <label className="kyc-label">Date of Birth</label>
                <div className="kyc-input-wrap">
                  <span className="kyc-input-prefix">🎂</span>
                  <input className="kyc-input kyc-input-date" type="date" value={dob}
                    onChange={(e) => setDob(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="kyc-field-group">
              <label className="kyc-label">Phone Number</label>
              <div className="kyc-input-wrap">
                <span className="kyc-input-prefix">📞</span>
                <input className="kyc-input" placeholder="+91 98765 43210" type="tel" value={phone}
                  onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            <div className="kyc-field-group">
              <label className="kyc-label">Residential Address</label>
              <div className="kyc-input-wrap">
                <span className="kyc-input-prefix">🏠</span>
                <input className="kyc-input" placeholder="Street, House No." value={address}
                  onChange={(e) => setAddress(e.target.value)} required />
              </div>
            </div>

            <div className="kyc-row">
              <div className="kyc-field-group">
                <label className="kyc-label">City</label>
                <div className="kyc-input-wrap">
                  <span className="kyc-input-prefix">🏙</span>
                  <input className="kyc-input" placeholder="City" value={city}
                    onChange={(e) => setCity(e.target.value)} required />
                </div>
              </div>
              <div className="kyc-field-group">
                <label className="kyc-label">PIN Code</label>
                <div className="kyc-input-wrap">
                  <span className="kyc-input-prefix">📮</span>
                  <input className="kyc-input" placeholder="6-digit PIN" type="number" value={pincode}
                    onChange={(e) => setPincode(e.target.value)} required />
                </div>
              </div>
            </div>

            <button type="submit" className="kyc-submit-btn">
              Continue to Documents →
            </button>
          </form>
        )}

        {/* Step 1 — Document Upload */}
        {step === 1 && (
          <form onSubmit={handleNext} className="kyc-form">
            <div className="kyc-field-group">
              <label className="kyc-label">Document Type</label>
              <div className="kyc-select-wrap">
                <select className="kyc-select" value={docType}
                  onChange={(e) => setDocType(e.target.value)}>
                  {docTypes.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                <span className="kyc-select-arrow">▾</span>
              </div>
            </div>

            <div className="kyc-field-group">
              <label className="kyc-label">Document Number</label>
              <div className="kyc-input-wrap">
                <span className="kyc-input-prefix">🪪</span>
                <input className="kyc-input" placeholder="Enter document number"
                  value={docNumber} onChange={(e) => setDocNumber(e.target.value)} required />
              </div>
            </div>

            <div className="kyc-row">
              <div className="kyc-field-group">
                <label className="kyc-label">Front Side <span className="kyc-req-star">*</span></label>
                <FileUploadBox label="Upload Front" file={docFront}
                  inputRef={frontRef} onChange={setDocFront} required />
              </div>
              <div className="kyc-field-group">
                <label className="kyc-label">Back Side</label>
                <FileUploadBox label="Upload Back" file={docBack}
                  inputRef={backRef} onChange={setDocBack} />
              </div>
            </div>

            <div className="kyc-field-group">
              <label className="kyc-label">Selfie with Document</label>
              <FileUploadBox label="Upload Selfie (optional)" file={selfie}
                inputRef={selfieRef} onChange={setSelfie} />
            </div>

            <div className="kyc-btn-row">
              <button type="button" className="kyc-back-btn" onClick={() => setStep(0)}>
                ← Back
              </button>
              <button type="submit" className="kyc-submit-btn kyc-submit-flex">
                Review & Submit →
              </button>
            </div>
          </form>
        )}

        {/* Step 2 — Review */}
        {step === 2 && (
          <div className="kyc-form">
            <div className="kyc-review-section">
              <h3 className="kyc-review-heading">Personal Details</h3>
              <div className="kyc-review-grid">
                {[
                  ['Full Name', fullName],
                  ['Date of Birth', dob],
                  ['Phone', phone],
                  ['Address', address],
                  ['City', city],
                  ['PIN Code', pincode],
                ].map(([k, v]) => (
                  <div key={k} className="kyc-review-item">
                    <span className="kyc-review-key">{k}</span>
                    <span className="kyc-review-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kyc-review-section">
              <h3 className="kyc-review-heading">Document Details</h3>
              <div className="kyc-review-grid">
                {[
                  ['Document Type', docTypes.find(d => d.value === docType)?.label],
                  ['Document Number', docNumber],
                  ['Front Image', docFront?.name || '—'],
                  ['Back Image', docBack?.name || '—'],
                  ['Selfie', selfie?.name || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="kyc-review-item">
                    <span className="kyc-review-key">{k}</span>
                    <span className="kyc-review-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="kyc-btn-row">
              <button type="button" className="kyc-back-btn" onClick={() => setStep(1)}>
                ← Edit
              </button>
              <button
                className="kyc-submit-btn kyc-submit-flex"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <span className="kyc-btn-spinner" /> : 'Submit KYC ✓'}
              </button>
            </div>
          </div>
        )}

        <div className="kyc-footer">
          <Link to="/borrower/dashboard" className="kyc-back-link">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default KycVerification