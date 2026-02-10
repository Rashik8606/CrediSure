import './App.css';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Login from './auth/UserLogin';
import UserRegister from './auth/UserRegister';
import { Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import BorrowerPage from './pages/BorrowerPage';
import ChangePassword from './auth/ChangePassword';
import LoanRequestForm from './pages/LoanRequestForm';
import KycVerification from './pages/KycVerification';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/login'/>} />

        <Route path='/login' element={< Login />}/>
        <Route path='/register' element={ < UserRegister/>}/>
        <Route path='/admin/dashboard' element={<AdminPage />}/>
        <Route path='/borrower/dashboard' element={< BorrowerPage/>}/>
        <Route path='/change-password' element={< ChangePassword/>}/>
        <Route path='/loan-request-form' element={< LoanRequestForm/>}/>
        <Route path='/kyc-verification' element={< KycVerification/>}/>
        
      </Routes>
    </Router>
  );
}


export default App;
