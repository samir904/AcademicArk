import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import store from './REDUX/store.js'
import CustomToaster from './HELPERS/Toaster.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    {/* <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> */}
  <BrowserRouter>
    <App />
    <CustomToaster/>
  </BrowserRouter>
  {/* </GoogleOAuthProvider> */}
  </Provider>
)
