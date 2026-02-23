import React, { useEffect, useState } from 'react'
import API from '../api/axios'
import '../css/admin-dashboard.css'
import PageFooter from './PageFooter'
import PageNavBar from './PageNavBar'
import StatGauge from './StatGauge'


const AdminPage = () => {
  const [loans, setLoan] = useState([])

  const total = loans.length
  const approved = loans.filter(l => l.status === 'approved').length
  const pending = loans.filter(l => l.status === 'pending' || l.status === 'UNDER_REVIEW').length
  const rejected = loans.filter(l => l.status === 'rejected').length

  useEffect(()=>{
    loadLoans();
  },[]);

  const loadLoans = async ()=>{
    const res = await API.get('/loans/admin/all/');
    setLoan(res.data)
  }

  const approveLoans = async (loanId)=>{
    await API.post(`/loans/${loanId}/approve/`)
    alert('Loan Approved')
    loadLoans();
  }

  const rejectLoans = async (loanId) =>{
    await API.post(`/loans/admin/${loanId}/`,{
      status:'rejected'
    })
    alert('Loan Rejected')
    loadLoans();
      
    }
  return (
    <>
    <PageNavBar/>

    <div className='admin-page'>

      <div className='analysis-dashboard' >
        <StatGauge label='Approved' value={approved} color='#22c55e'/>
        <StatGauge label='Pending' value={pending} color='#facc15'/>
        <StatGauge label='Rejected' value={rejected} color='#ef4444'/>

    </div>

    {/* Desktop Response -----> */}
    </div>
      <div className='table-desktop'>
        <div className='table-wrapper'>
        <table className="loan-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>KYC</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.borrower_username}</td>
                <td>₹{loan.amount}</td>
                <td><span className={`badge ${loan.status}`}>{loan.status}</span></td>
                <td >
                  <span className={`badge kyc ${loan.kyc_status.toLowerCase()}`}>{loan.kyc_status}</span>
                </td>
                <td>
                  {loan.kyc_status === 'UNDER_REVIEW' && loan.status !== 'approved' && (
                    <>
                    <div className='action-buttons'>
                      <button className="approve" onClick={() => approveLoans(loan.id)}>
                        Approve
                      </button>
                      <button className="reject" onClick={() => rejectLoans(loan.id)}>
                        Reject
                      </button>
                    </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

            {/* Mobile response---------> */}
    <div className="table-mobile">
      {loans.map((loan) => (
        <div className="loan-card" key={loan.id}>
          <div><strong>User:</strong> {loan.borrower_username}</div>
          <div><strong>Amount:</strong> ₹{loan.amount}</div>
          <div><strong>Status:</strong> <span className={`badge ${loan.status}`}>{loan.status}</span></div>
          <div><strong>KYC:</strong> <span className={`badge kyc ${loan.kyc_status.toLowerCase()}`}>{loan.kyc_status}</span></div>

          {loan.kyc_status === 'UNDER_REVIEW' && (
            <div className="card-actions">
              <button type="button" class="btn btn-outline-success">Success</button>
              <button className="reject">Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>

      <a href='/change-password'>CHANGE PASSWORD</a>
  
    <PageFooter/>
    </>
  )
}

export default AdminPage;
