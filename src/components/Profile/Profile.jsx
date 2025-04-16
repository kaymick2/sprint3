/**
 * Profile.jsx
 * 
 * This component displays the user's profile information and saved jobs.
 * It fetches user attributes from AWS Cognito and displays them in a profile card.
 * The component also integrates the SavedJobs component to show the user's saved job listings.
 */

// Import AWS Amplify authentication hook
import { useAuthenticator } from '@aws-amplify/ui-react';
// Import React hooks
import { useEffect, useState } from 'react';
// Import the SavedJobs component
import SavedJobs from './SavedJobs';
// Import styles
import './Profile.css';
// Import AWS Amplify auth utility for fetching user attributes
import { fetchUserAttributes } from '@aws-amplify/auth';

/**
 * Profile Component
 * 
 * A component that displays the authenticated user's profile information and saved jobs.
 * Fetches user attributes from Cognito and formats them for display.
 * 
 * @returns {JSX.Element} The rendered profile component
 */
function Profile() {
  // Get the current authenticated user from Amplify
  const { user } = useAuthenticator((context) => [context.user]);
  // State to store the user's attributes
  const [userAttributes, setUserAttributes] = useState(null);

  /**
   * Effect hook to fetch user attributes when the component mounts
   * or when the user changes (e.g., after login/logout)
   */
  useEffect(() => {
    if (user) {
      // Fetch additional user attributes from Cognito
      fetchUserAttributes()
        .then(attributes => {
          // Parse and format the user attributes for display
          const parsed = {
            username: user.username,
            fullName: attributes.name || '',
            email: attributes.email || '',
            createdAt: user?.signInDetails?.authTime
              ? new Date(user.signInDetails.authTime * 1000).toLocaleDateString()
              : 'Unknown',
            authProvider: user?.signInDetails?.authFlowType || 'cognito'
          };

          // Update state with the parsed attributes
          setUserAttributes(parsed);
        })
        .catch(err => {
          // Log any errors that occur during attribute fetching
          console.error('❌ Failed to fetch attributes:', err);
        });
    }
  }, [user]); // Re-run effect when user changes

  // Display message if user is not authenticated
  if (!user) {
    return (
      <div className='profile-page'>
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  // Display loading indicator while fetching user attributes
  if (!userAttributes) {
    return (
      <div className='profile-page'>
        <p>Loading profile...</p>
      </div>
    );
  }

  /**
   * Render the profile information and saved jobs
   */
  return (
    <div className="profile-page">
      {/* Profile card with user information */}
      <div className="profile-container">
        {/* Profile Picture */}
        <div className='profile-picture-container'>
          <img
            src="/images/profilepic.png" // Placeholder for now
            alt="Profile"
            className='profile-picture'
          />
        </div>
        {/* Profile Card with user information */}
        <div className='profile-card'>
          <h1 className='profile-title'>User Profile</h1>
          <div className="profile-info">
            <InfoRow label="Full Name" value={userAttributes.fullName} />
            <InfoRow label="Username" value={userAttributes.username} />
            <InfoRow label="Email" value={userAttributes.email} />
            <InfoRow label="Member Since" value={userAttributes.createdAt} />
            <InfoRow label="Auth Provider" value={userAttributes.authProvider} />
          </div>

          {/* Edit Profile Button */}
          <div className='edit-button-container'>
            <button className='edit-button'>Edit Profile</button>
          </div>  
        </div>

        {/* Section for displaying saved jobs */}
        <div className="saved-jobs-wrapper">
          <h2 className='section-title'>Saved Jobs</h2>
          <SavedJobs />
        </div>
      </div>
    </div>
  );
}

/**
 * InfoRow Component
 * 
 * A helper component that displays a label-value pair in the profile card.
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - The label for the information row
 * @param {string} props.value - The value to display
 * @returns {JSX.Element} The rendered information row
 */
function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}:</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

export default Profile;
