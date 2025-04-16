/**
 * main.jsx
 * 
 * Application entry point that initializes React and configures AWS Amplify.
 * This file sets up the root React component and renders it to the DOM.
 */

// Import React core components
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import global styles
import './index.css'

// Import the root App component
import App from './App.jsx'

// Import AWS Amplify for authentication and AWS services
import { Amplify } from 'aws-amplify'
import awsconfig from './amplify-config.js'

/**
 * Configure AWS Amplify with the settings from amplify-config.js
 * This sets up authentication, API, and other AWS services for the application
 */
Amplify.configure(awsconfig, { ssr: false })

/**
 * Create a React root and render the App component inside StrictMode
 * 
 * StrictMode enables additional development checks and warnings:
 * - Identifies components with unsafe lifecycles
 * - Warns about legacy string ref API usage
 * - Detects unexpected side effects
 * - Ensures reusable state
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
