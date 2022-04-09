import React from 'react'
import Dashboard from './components/home/home'
import Navbar from './components/navbar/navbar'
import Rewards from './components/Reward/Reward'
import './App.css'
import Movies from './pages/customer/Movies'
import AddAdmin from './components/AddAdmin/AddAdmin'
import RemoveAdmin from './components/RemoveAdmin/RemoveAdmin'

const App = () => {


  return (
    <>
    <div className="App">
   
        <>
         <div className="gradient__bg">
          <Navbar />
          <Dashboard />
          <Rewards />
          <AddAdmin />
          <RemoveAdmin />
        </div>
        </>
     
    </div>

    </>
  )
}

export default App

// login using metamask, admin dashboard , remove and add admins 
// live update of tokens sent