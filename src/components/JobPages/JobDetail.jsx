/**
 * JobDetail.jsx
 * 
 * This component displays detailed information about a specific job listing.
 * It fetches job data from an AWS API Gateway endpoint based on the job ID
 * from the URL parameters and renders a comprehensive view of the job details.
 * It also increments the view count for the job in the DynamoDB table.
 */

// Import React hooks
import React, { useState, useEffect } from 'react';
// Import React Router hook to access URL parameters
import { useParams } from 'react-router-dom';
// Import styles
import './JobREUDetails.css'
// Import the job views utility
import { incrementJobViews } from '../../utils/jobViewsDB';

/**
 * JobDetail Component
 * 
 * A component that displays detailed information about a specific job listing.
 * Fetches job data from an AWS API Gateway endpoint based on the job ID from URL parameters.
 * 
 * @returns {JSX.Element} The rendered job detail component
 */
const JobDetail = () => {
  // Extract job ID from URL parameters
  const { id } = useParams();
  // State to store the job data
  const [job, setJob] = useState(null);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to track and display any errors
  const [error, setError] = useState(null);

  /**
   * Effect hook to fetch job details when the component mounts
   * or when the job ID changes, and increment the view count
   */
  useEffect(() => {
    /**
     * Async function to fetch job details from the API
     * and increment the view count
     */
    const fetchJob = async () => {
      try {
        // Fetch job data from the API Gateway endpoint using the job ID
        const response = await fetch(`https://ixmv8lw2lj.execute-api.us-east-2.amazonaws.com/linkedinDB/reading?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        console.log(data);
        const selectedJob = data.body[0];
        
        if (!selectedJob) {
          throw new Error('Job not found');
        }
        
        // Update state with the fetched job
        setJob(selectedJob);
        
        // Use sessionStorage to track if we've already incremented the view for this job
        // This prevents multiple increments during development with StrictMode or page refreshes
        const viewKey = `job_${id}_viewed`;
        if (!sessionStorage.getItem(viewKey)) {
          // Only increment if we haven't already for this session
          try {
            await incrementJobViews(id);
            console.log('View count incremented for job:', id);
            // Mark this job as viewed in this session
            sessionStorage.setItem(viewKey, 'true');
          } catch (viewErr) {
            console.error('Failed to increment view count:', viewErr);
            // Don't throw error here to avoid disrupting the user experience
          }
        } else {
          console.log('View already counted for job:', id);
        }
      } catch (err) {
        // Set error state if fetch fails
        setError(err.message);
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]); // Re-run effect when job ID changes

  // Display loading indicator while fetching data
  if (loading) return <p>Loading job details...</p>;
  // Display error message if an error occurred
  if (error) return <p>Error: {error}</p>;

  /**
   * Render the job details
   */
  return (
    <div className="container py-4">
      <h1 className="job-title mb-4">{job.title}</h1>
      <div className="card">
        <div className="card-body">
          <h4 className="company-name text-muted mb-4">{job.company_name}</h4>
          <div className="row mb-4">
            <div className="col-md-6">
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Work Type:</strong> {job.formatted_work_type}</p>
              <p><strong>Experience Level:</strong> {job.formatted_experience_level}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Salary:</strong> {job.currency} {job.min_salary.toLocaleString()} - {job.max_salary.toLocaleString()} {job.pay_period}</p>
              <p><strong>Views:</strong> {job.views}</p>
            </div>
          </div>
          <h5 className="mb-3">Job Description</h5>
          <div className="job-description mb-4">{job.description}</div>
          <div className="apply-buttons mt-4">
            <a href={job.job_posting_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary me-2">
              View on LinkedIn
            </a>
            <a href={job.application_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;