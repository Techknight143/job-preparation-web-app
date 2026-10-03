import {Routes, Route} from 'react-router'
import { AuthProvider } from './features/auth/auth.context'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import { Protected } from './features/auth/components/Protected'
import HomePage from './features/interview/pages/HomePage'
import Interview from './features/interview/pages/Interview'
import { InterviewProvider } from './features/interview/interview.context'
function App() {

  return (
    <InterviewProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/' element={<Protected><HomePage /></Protected>} />
          <Route path='/interview/:interviewId' element={<Protected><Interview /></Protected>} />
        </Routes>
      </AuthProvider>
    </InterviewProvider>
   
  )
}

export default App
