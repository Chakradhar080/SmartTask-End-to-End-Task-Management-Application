import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Optional: create a global context for backend URL
export const BackendContext = React.createContext('http://127.0.0.1:8000')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BackendContext.Provider value="http://127.0.0.1:8000">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BackendContext.Provider>
  </React.StrictMode>
)
