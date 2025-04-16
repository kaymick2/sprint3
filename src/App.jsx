/**
 * App.jsx
 * 
 * Root component of the application that sets up routing and main layout.
 * Uses React Router for navigation between different views and AWS Amplify for authentication.
 * 
 * Features:
 * - Implements client-side routing with React Router
 * - Integrates AWS Amplify authentication
 * - Provides consistent layout with navigation bar
 * - Implements protected routes that require authentication
 * - Renders different components based on current route
 */

// Import routing components from React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import authentication components from AWS Amplify
import { useAuthenticator, Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

// Import Bootstrap for styling
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

// Import application components
import EmployerAuthentication from './components/Authenticator/EmployerAuthentication'
import Navbar from './components/Home/Navbar'
// Import job-related components
import JobList from './components/JobPages/JobList'
import REUSites from './components/JobPages/REUSites'
import JobDetail from './components/JobPages/JobDetail'

// Import home page component
import Home from './components/Home/Home'

// Import authentication-related components
import Authentication from './components/Authenticator/Authentication'
import ProtectedRoute from './components/Authenticator/ProtectedRoute'

// Import user profile component
import Profile from './components/Profile/Profile'
import { use } from 'react'
import context from 'react-bootstrap/esm/AccordionContext'

/**
 * Main App component that defines the application structure and routing
 * 
 * This component wraps the entire application with the Authenticator provider
 * from AWS Amplify and sets up all the routes using React Router.
 * 
 * @returns {JSX.Element} The rendered application
 */
function AppContent() {
  const { authStatus } = useAuthenticator(context => [context.authStatus])

  if (authStatus === 'configuring') {
    return <div>Loading app...</div>
  }

  return (
    <Router>
      {/* Set up routing with BrowserRouter */}
      <div className="App">
        <div className="container text-center">
          <br />
          {/* Global navigation bar shown on all pages */}
          <Navbar />
        </div>

          {/* Define all application routes */}
          <Routes>
            {/* Authentication routes */}
            <Route path="/auth" element={<Authentication />} />
            <Route path="/employer-auth" element={<EmployerAuthentication />} />
            
            {/* Public home page */}
            <Route path="/" element={<Home />} />
            
            {/* Protected routes that require authentication */}
            <Route path="/jobs" element={
              <ProtectedRoute>
                <div className='container text-center'>
                  <JobList />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/job/:id" element={
              <ProtectedRoute>
                <div className='container text-center'>
                  <JobDetail />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/reu-sites" element={
              <ProtectedRoute>
                <div className='container text-center'>
                  <REUSites />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
  )
}

function App() {
  return (
    // Wrap the app with Authenticator.Provider to enable authentication throughout the app
    <Authenticator.Provider>
      <AppContent />
    </Authenticator.Provider>
  )
}

// Export the App component as the default export
export default App