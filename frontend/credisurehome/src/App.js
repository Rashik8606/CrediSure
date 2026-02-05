import './App.css';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Login from './auth/UserLogin';
import UserRegister from './auth/UserRegister';
import { Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import BorrowerPage from './pages/BorrowerPage';
import ChangePassword from './auth/ChangePassword';


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
        
      </Routes>
    </Router>
  );
}


export default App;
