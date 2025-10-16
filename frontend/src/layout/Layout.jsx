import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
        <Navbar/>
        <Outlet/> {/*this is where child routes will render  */}
    </div>
  )
}

export default Layout
