import React from 'react'
import Header from '../components/header/Header'
import { Outlet } from 'react-router'

const FullPageLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default FullPageLayout
