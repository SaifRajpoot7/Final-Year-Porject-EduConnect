import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './contexts/AppContext.jsx'
import { BrowserRouter } from 'react-router'
import StreamVideoProvider from './providers/StreamVideoProvider';
import FullPageLoaderComponent from './components/FullPageLoaderComponent.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* <StrictMode> */}
      <AppProvider>
        <StreamVideoProvider>
          <App />
          {/* <FullPageLoaderComponent /> */}
        </StreamVideoProvider>
      </AppProvider>
    {/* </StrictMode> */}
  </BrowserRouter>
)
