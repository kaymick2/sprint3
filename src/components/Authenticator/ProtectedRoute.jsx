import { Navigate } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'

/**
 * ProtectedRoute Component
 * 
 * A wrapper component that protects routes from unauthorized access.
 * Uses AWS Amplify Authenticator to check authentication status.
 * Redirects to the authentication page if user is not signed in.
 * 
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 */
function ProtectedRoute({ children }) {
  const { authStatus } = useAuthenticator(context => [context.authStatus])

  if (authStatus === 'configuring') {
    // Redirect to authentication page if user is not authenticated
    return <div>Loading...</div>
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/auth" replace />
  }

  // Render child components if user is authenticated
  return children
}

export default ProtectedRoute