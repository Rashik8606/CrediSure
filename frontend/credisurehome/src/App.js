import './App.css';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Login from './auth/UserLogin';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/login'/>} />

        <Route path='/login' element={< Login />}/>
      </Routes>
    </Router>
  );
}


export default App;
