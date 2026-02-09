import React, { useEffect, useState } from 'react'
import API from '../api/axios'
import '../css/admin-dashboard.css'


const AdminPage = () => {
  const [loans, setLoan] = useState([])

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
    <div className='admin-container'>
      <h1>WELCOME TO ADMIN LOAN MANAGEMENT</h1>
      <table className='loan-table'>
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
          {loans.map((loan)=>(
            <tr key={loan.id}>
              <td>{loan.borrower_username}</td>
              <td>${loan.amount}</td>
              <td className={`status ${loan.status}`}>{loan.status}</td>
              <td>{loan.kyc_status}</td>

              <td>
                {loan.status === 'pending' && loan.kyc_status === 'verified' && (
                  <>
                    <button className="approve" onClick={() => approveLoans(loan.id)}>
                      Approve
                    </button>
                    <button className="reject" onClick={() => rejectLoans(loan.id)}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      



      <a href='/login'>BACK TO LOGIN PAGE</a><br/>
      <a href='/change-password'>CHANGE PASSWORD</a>
    </div>
  )
}

export default AdminPage;
