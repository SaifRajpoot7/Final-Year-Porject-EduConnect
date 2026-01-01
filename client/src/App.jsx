import React from 'react'
import AppRouter from './routers/AppRouter'
import { ToastContainer } from 'react-toastify'
import "@stream-io/video-react-sdk/dist/css/styles.css";

const App = () => {
  return (
    <>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
      <AppRouter />
    </>
  )
}

export default App
