import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

import { Header } from './components/Header.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { Body } from './components/Body.jsx'

import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Sidebar />
      <Body />
      <App />
    </BrowserRouter>
  </StrictMode>,
)