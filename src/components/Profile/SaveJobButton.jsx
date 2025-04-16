/**
 * SaveJobButton.jsx
 * 
 * This component provides a button that allows users to save job listings to their profile.
 * It integrates with the savedJobsDB utility to store job data in DynamoDB and requires
 * user authentication to function.
 */

// Import React hooks
import { useState } from 'react'

// Import AWS Amplify authentication hook
import { useAuthenticator } from '@aws-amplify/ui-react'

// Import the saveJob function from the savedJobsDB utility
import { saveJob } from '../../utils/savedJobsDB'

// Import styles
import '/src/components/JobPages/JobREUDetails.css'

/**
 * SaveJobButton Component
 * 
 * A button component that allows authenticated users to save job listings to their profile.
 * Uses the savedJobsDB utility to store job data in DynamoDB.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.jobData - The job data to save (must include id, title, and other job details)
 * @param {Function} props.onSaved - Optional callback function to execute after successfully saving a job
 * @returns {JSX.Element} The rendered save button component
 */
function SaveJobButton({ jobData, onSaved, className }) {
  // Get the current authenticated user from Amplify
  const { user } = useAuthenticator((context) => [context.user])
  
  // State to track the saving process
  const [saving, setSaving] = useState(false)
  
  // State to track and display any errors
  const [error, setError] = useState(null)

  /**
   * Handle the save job action
   * 
   * This function is called when the user clicks the Save Job button.
   * It checks if the user is authenticated, then calls the saveJob function
   * from the savedJobsDB utility to store the job in DynamoDB.
   */
  const handleSave = async () => {
    // Check if user is authenticated
    if (!user) {
      setError('Please sign in to save jobs')
      return
    }

    // Set saving state to show loading indicator
    setSaving(true)
    // Clear any previous errors
    setError(null)

    try {
      // Call the saveJob function from savedJobsDB utility
      // Pass the user's username as the userId and the job data
      await saveJob(user.username, jobData)
      
      // Call the onSaved callback if provided
      if (onSaved) {
        onSaved()
      }
    } catch (err) {
      // Log and display any errors that occur
      console.error('Error saving job:', err)
      setError('Failed to save job')
    } finally {
      // Reset saving state regardless of success or failure
      setSaving(false)
    }
  }

  /**
   * Render the save button and any error messages
   */
  return (
    <div>
      {/* Save job button with dynamic text based on saving state */}
      <button
        className={className || 'save-btn'}

        onClick={handleSave}
        disabled={saving} // Disable button while saving
      >
        {saving ? 'Saving...' : 'Save Job'}
      </button>
      
      {/* Display error message if there is one */}
      {error && (
        <div className="error-message">{error}</div>
      )}
    </div>
  )
}

export default SaveJobButton
