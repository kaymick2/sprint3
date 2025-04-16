/**
 * Authentication.jsx
 * 
 * This component provides a complete authentication interface using AWS Amplify Authenticator.
 * It includes customized UI theming, form field configurations, and custom header/footer components.
 * The component handles user sign-up, sign-in, password reset, and other authentication flows.
 */

// Import AWS Amplify authentication components
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react'
// Import custom authentication theme
import theme from './authTheme'
// Import AWS Amplify UI styles
import '@aws-amplify/ui-react/styles.css'

import { useEffect } from 'react'
import { Amplify } from 'aws-amplify'
import awsconfig from '../../amplify-config.js'



/**
 * Authentication Component
 * 
 * A dedicated page component for handling user authentication.
 * Uses AWS Amplify Authenticator for sign-in and sign-up functionality.
 * 
 * Features:
 * - Email-based authentication
 * - Sign-in and sign-up forms
 * - Centralized authentication handling
 * - Custom themed components
 * - Responsive design
 */
function Authentication({ onSignIn }) {
  useEffect(() => {
    Amplify.configure({ ...awsconfig }, { forceLegacySettings: true })
  }, [])

  return (
    <div className="mt-5">
      <ThemeProvider theme={theme}>
      <Authenticator
  loginMechanisms={['username']}
  hideSignUp={false}
  onSignIn={onSignIn}
  formFields={{
    signUp: {
      username: {
        order: 1,
        isRequired: true,
        label: 'Username',
        placeholder: 'Choose a unique username'
      },
      email: {
        order: 2,
        isRequired: true,
        label: 'Email',
        placeholder: 'you@example.com'
      },
      name: {
        order: 3,
        isRequired: true,
        label: 'Full Name',
        placeholder: 'Your full name'
      },
      password: {
        order: 4,
        isRequired: true,
        label: 'Password',
        placeholder: 'Create a password'
      },
      confirm_password: {
        order: 5,
        isRequired: true,
        label: 'Confirm Password'
      }
    }
  }}
  components={{
    Header() {
      return (
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontFamily: 'Lato, system-ui, sans-serif',
            fontSize: '2rem',
            fontWeight: '700',
            color: '#212529',
            marginBottom: '0.75rem'
          }}>Welcome</h2>
          <p style={{
            fontFamily: 'Lato, system-ui, sans-serif',
            fontSize: '1.1rem',
            color: '#6c757d',
            margin: 0
          }}>Sign in to access over 1000+ jobs!</p>
        </div>
      )
    },
    Footer() {
      return (
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #dee2e6'
        }}>
          <p style={{
            fontFamily: 'Lato, system-ui, sans-serif',
            fontSize: '0.875rem',
            color: '#6c757d',
            margin: 0
          }}>© 2024 Job Search Platform. All rights reserved.</p>
        </div>
      )
    }
  }}
>
  {({ signOut, user }) => (
    <div className="my-4">
      <p>Hello, {user.username}</p>
      <button className="btn btn-danger" onClick={signOut}>
        Sign Out
      </button>
    </div>
  )}
</Authenticator>

      </ThemeProvider>
    </div>
  )
}

export default Authentication