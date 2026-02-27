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

  //search filter
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLoan = loans.filter(loan => loan.borrower_username.toLowerCase().includes(searchTerm.toLowerCase()))
  // Pagination stat
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  // calculate index
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  // slices Data
  const currentLoan = filteredLoan.slice(indexOfFirstRow, indexOfLastRow)
  // total pages
  const totalPage = Math.ceil(filteredLoan.length / rowsPerPage)


  useEffect(()=>{
    loadLoans();
  },[]);

  const loadLoans = async ()=>{
    const res = await API.get('/loans/admin/all/');
    setLoan(res.data.reverse())
  }

  const approveLoans = async (loanId)=>{
    await API.post(`/loans/${loanId}/approve/`)
    alert('Loan Approved')
    loadLoans();
  }

  const rejectLoans = async (loanId) =>{
    await API.post(`/loans/${loanId}/reject/`,{
      status:'rejected'
    })
    alert('Loan Rejected')
    loadLoans();
      
    }
  return (
    <div className='all-page'>
    <PageNavBar onSearch={setSearchTerm}/>
    
    <div className='admin-page'>

      <div className='admin-header'>
        <div>
          <h1 className='admin-title'>Admin <span>Panel</span></h1>
          <p className='admin-sub'>{total} total applications</p>
        </div>
      </div>

      <div className='analysis-dashboard' >
        <StatGauge label='Approved' value={approved} color='#22c55e'/>
        <StatGauge label='Pending' value={pending} color='#facc15'/>
        <StatGauge label='Rejected' value={rejected} color='#ef4444'/>

    </div>

    {/* Desktop Response -----> */}
    </div>
      <div className='table-desktop'>
        <div className='table-toolbar'>
          <span className='table-title'>All Applications</span>
          <span className='table-count'>Page {currentPage} / {totalPage || 1}</span>
        </div>
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
            {currentLoan.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.borrower_username}</td>
                <td>₹{Number(loan.amount).toLocaleString('en-IN')}</td>
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
          <div><strong>Amount:</strong> ₹{Number(loan.amount).toLocaleString('en-IN')}</div>
          <div><strong>Status:</strong> <span className={`badge ${loan.status}`}>{loan.status}</span></div>
          <div><strong>KYC:</strong> <span className={`badge kyc ${loan.kyc_status.toLowerCase()}`}>{loan.kyc_status}</span></div>

          {loan.kyc_status === 'UNDER_REVIEW' && (
            <div className="card-actions">
              <button type="button" className="approve" onClick={() => approveLoans(loan.id)}>Approve</button>
              <button className="reject" onClick={() => rejectLoans(loan.id)}>Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
      <div className='pagination'>
        <button disabled={currentPage === 1} onClick={()=>setCurrentPage(prev => prev -1)}>← Prev</button>
        {[...Array(totalPage)].map((_,index)=>(
          <button key={index} className={currentPage=== index +1 ? 'active' : ''} onClick={()=> setCurrentPage(index+1)}>{index+1}</button>
        ))}

        <button disabled={currentPage === totalPage} onClick={()=>setCurrentPage(prev => prev +1 )}>Next →</button>
      </div>
      <a href='/change-password'>⬡ Change Password</a>
      
    <PageFooter/>
  </div>
  )
}

export default AdminPage;