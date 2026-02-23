import React from 'react'
import '../css/footer.css'

const PageFooter = () => {
  return (
    <footer className='admin-footer'>
        <p>@ {new Date().getFullYear()} Loan Management System</p>
        <p className='footer-small'>Secure * Fast * Reliable</p>
    </footer>
  )
}

export default PageFooter
