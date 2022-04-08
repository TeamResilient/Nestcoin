import React from 'react'
import Dashboard from './components/home/home'
import Navbar from './components/navbar/navbar'
import Rewards from './components/rewards'
import Login from './components/login/login'
import { useMoralis } from 'react-moralis'
import './App.css'
import Movies from './pages/customer/Movies'
import AddAdmin from './components/AddAdmin/AddAdmin'
import RemoveAdmin from './components/RemoveAdmin/RemoveAdmin'

const App = () => {

  const {isAuthenticated,logout} = useMoralis();

  return (
    <>
    <div className="App">
    {
      isAuthenticated ? (
        <>
         <div className="gradient__bg">
    <Navbar />
    <Dashboard />
    <Rewards />
    <AddAdmin />
    <RemoveAdmin />
    </div>
    </>
      ) : (
      <div>
        <Login />
    </div>
      )}
    </div>
    <Movies />
    </>
  )
}

export default App

// login using metamask, admin dashboard , remove and add admins 
// live update of tokens sent