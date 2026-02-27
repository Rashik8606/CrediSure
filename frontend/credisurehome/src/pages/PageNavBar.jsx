import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/navbar.css'
import { Link } from 'react-router-dom'

const PageNavBar = ({onSearch}) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const navigate = useNavigate()
    const logout = ()=>{
        localStorage.removeItem('access_token')
        navigate('/login')
    }
  return (      
    <div>

    <link href="https://cdn.ux4g.gov.in/UX4G@2.0.8/css/ux4g-min.css" rel="stylesheet"></link>
    <nav className="navbar navbar-expand-lg bg-black fixed-top shadow-sm">
      
      <div className="container-fluid">

        {/* LEFT */}
        <div className="d-flex align-items-center gap-2">
          <img
            src="https://doc.ux4g.gov.in/assets/img/logo/national-emblem.png"
            className="gov-emblem"
            alt="National Emblem"
          />
          <strong className="gov-text">Government of India</strong>
        </div>

        {/* BRAND */}
        <Link className="navbar-brand ms-3" to="/admin/dashboard">
          CredisureIND
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* COLLAPSE */}
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-center gap-2">

        {/* DASHBOARD */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/dashboard">
            Dashboard
          </Link>
        </li>

        {/* ACCOUNT DROPDOWN */}
        <li
          className={`nav-item dropdown ${dropdownOpen ? 'show' : ''}`}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <button
            className="nav-link dropdown-toggle btn btn-link"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Account
          </button>

          <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`}>
            <li>
              <Link className="dropdown-item" to="/admin/profile">
                Profile
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/change-password">
                Change Password
              </Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item" onClick={logout}>
                Logout
              </button>
            </li>
          </ul>
        </li>
        
  {/* SEARCH (LAST) */}
  {/* SEARCH (LAST) */}
<li className="nav-item">
  <form className="d-flex align-items-center" role="search"> 
    <input
      className="form-control form-control-sm me-1"
      type="search"
      placeholder="Search"
      onChange={(e) => onSearch(e.target.value)}
      aria-label="Search"
      style={{ width: '140px' }}
    />
    <button style={{color:'blue'}} className="btn btn-sm btn-outline-secondary" type="submit">
      SEARCH
    </button>
  </form>
</li>

</ul>
        </div>
      </div>
    </nav>
</div>
    
  )
}

export default PageNavBar
