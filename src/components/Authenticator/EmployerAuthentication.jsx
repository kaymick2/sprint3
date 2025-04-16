/**
 * EmployerAuthentication.jsx
 * 
 * This component provides a specialized authentication interface for employer users.
 * It extends the standard authentication flow with additional employer-specific fields
 * such as company name, address, and website.
 * 
 * The component uses AWS Amplify Authenticator with custom form field configurations
 * to create a tailored sign-up experience for employers.
 */

// Import AWS Amplify authentication components
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react'
// Import custom authentication theme
import theme from './authTheme'
// Import AWS Amplify UI styles
import '@aws-amplify/ui-react/styles.css'

// React and AWS Amplify imports
import { useEffect } from 'react'
import { Amplify } from 'aws-amplify'
import employerConfig from '../../amplify-employer-config.js'



/**
 * EmployerAuthentication Component
 * 
 * A specialized authentication component for employer users with company-specific fields.
 * Uses AWS Amplify Authenticator with custom form field configurations.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSignIn - Callback function to execute after successful sign-in
 * @returns {JSX.Element} The rendered employer authentication component
 */
function EmployerAuthentication({ onSignIn }) {
    useEffect(() => {
      // Reset and reconfigure Amplify for employer auth
      Amplify.configure({ ...employerConfig }, { forceLegacySettings: true })
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
                    placeholder: 'Choose a unique username',
                  },
                  nickname: {
                    order: 2,
                    isRequired: true,
                    label: 'Company Name',
                    placeholder: 'Your company name',
                  },
                  email: {
                    order: 3,
                    isRequired: true,
                    label: 'Email',
                    placeholder: 'company@example.com',
                  },
                  address: {
                    order: 4,
                    isRequired: true,
                    label: 'Company Address',
                    placeholder: '123 Main St, City, Country',
                  },
                  website: {
                    order: 5,
                    isRequired: true,
                    label: 'Company Website',
                    placeholder: 'https://example.com',
                  },
                  password: {
                    order: 6,
                    isRequired: true,
                    label: 'Password',
                    placeholder: 'Create a password',
                  },
                  confirm_password: {
                    order: 7,
                    isRequired: true,
                    label: 'Confirm Password',
                  },
                },
              }}
            />
          </ThemeProvider>
        </div>
      )
    }
    
    export default EmployerAuthentication