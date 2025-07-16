import { useState, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
// Components
import Navbar from './components/Navbar';
import { Loader } from 'lucide-react';
// Pages
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
// Other
import { useAuthStore } from './store/useAuthStore';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  
  // Zustand-provided auth store. Very convenient since the reference to the same store can be accessed from any component.
  const {authUser, checkAuth, isCheckingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log({authUser});

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div>

      <Navbar />
      <Routes>
        <Route path='/' element={ authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={ !authUser ? <SignUpPage /> : <Navigate to="/" />}/>
        <Route path='/login' element={ !authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/settings' element={ authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path='/profile' element={ authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

    </div>
  )
}

export default App;
