import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Loginpage from './pages/Loginpage'
import TeamDashboard from './pages/TeamDashboard'
import RegisterPage from './pages/RegisterPage'
import Protected from './Components/Protectedroute'


const App = () => {
  return (
    <div >
      
      <Routes>
        <Route path='/' element={<Loginpage />}/>
        <Route path='/Register' element={<RegisterPage />}/>
        <Route path='/Dashboard' element={<Protected><Dashboard /></Protected>}/>
        <Route path='/TeamDashboard/:id' element={<Protected><TeamDashboard /></Protected>}/>
        <Route path='*' element={<Loginpage />}/>
      </Routes>



    </div>
  )
}

export default App