import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Entry point of the React application
// React will inject everything inside the "root" div in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* App component holds the entire project (routes, providers, etc.) */}
    {/* Note: BrowserRouter is already inside App.js, so we don’t add it here */}
    <App />
  </React.StrictMode>,
)
