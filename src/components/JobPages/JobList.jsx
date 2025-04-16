/**
 * JobList.jsx
 * 
 * This component displays a paginated, searchable list of job listings.
 * It allows users to filter jobs by search term and location, and navigate to job details.
 * The component fetches job data from an AWS API Gateway endpoint and provides pagination controls.
 */

import React, { useState, useEffect, useContext, createContext } from 'react';
import SaveJobButton from '../Profile/SaveJobButton';
import { Link } from 'react-router-dom';
import './JobPages.css'; // Import the external CSS file

/**
 * FilterContext
 * 
 * React Context used to share filter state between the JobList component and its child FilterControls component.
 * This allows filter controls to be defined in a separate component while maintaining shared state.
 */
const FilterContext = createContext();

/**
 * JobList Component
 * 
 * Main component that displays a paginated and filterable list of job listings.
 * Fetches job data from an AWS API Gateway endpoint and provides an interface
 * for users to browse, filter, and interact with job listings.
 * 
 * @returns {JSX.Element} The rendered JobList component
 */

const formatSalary = (amount, currency) => {
    if (typeof amount !== 'number') return '';
    const formatted = amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    return currency === 'USD' ? `$${formatted}` : `${formatted} ${currency}`;
};
const JobList = () => {
    // State for job listings data
    const [jobs, setJobs] = useState([]);
    // Loading state to show loading indicator
    const [loading, setLoading] = useState(true);
    // Error state to handle and display fetch errors
    const [error, setError] = useState(null);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const jobsPerPage = 10; // Number of jobs per page
    
    // Filter state with default empty values
    const [filters, setFilters] = useState({ 
        location: "", // Filter by job location (state)
        company: "", // Filter by company name
        formatted_work_type: "", // Filter by job type (full-time, part-time, etc.)
        minSalary: "", // Filter by minimum salary
        maxSalary: "", // Filter by maximum salary
        experience_level: "" // Filter by required experience level
    });

    const [searchQuery, setSearchQuery] = useState(""); // New state for search query

    /**
     * Effect hook to fetch job data when component mounts
     * 
     * Makes an API call to the AWS API Gateway endpoint that retrieves job listings
     * from the DynamoDB database. Sets the jobs state with the fetched data and
     * updates loading and error states accordingly.
     */
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch job data from the API Gateway endpoint
                const response = await fetch("https://ixmv8lw2lj.execute-api.us-east-2.amazonaws.com/linkedinDB/reading");
                
                // Check if the response is successful
                if (!response.ok) {
                    throw new Error("Failed to fetch jobs");
                }
                
                // Parse the JSON response
                const data = await response.json();
                console.log(data);
                
                // Extract jobs array from response body and ensure it's an array
                const jobsArray = Array.isArray(data.body) ? data.body : [];
                console.log(jobsArray);
                
                // Update state with the fetched jobs
                setJobs(jobsArray);
                setTotalJobs(jobsArray.length);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError(err.message);
            } finally {
                // Set loading to false regardless of success or failure
                setLoading(false);
            }
        };
        
        // Execute the fetch function
        fetchJobs();
    }, []); // Empty dependency array means this effect runs once on mount

    /**
     * Filter jobs based on the current filter criteria
     * 
     * Applies all active filters to the jobs array and returns only the jobs that match all criteria.
     * Each filter is only applied if it has a non-empty value, allowing for flexible filtering.
     */
    const filteredJobs = jobs.filter(job => 
        // Location filter - checks if job location includes the selected state code
        (filters.location === "" || (job.location && job.location.includes(filters.location))) &&
        // Company name filter - case-insensitive partial match
        (filters.company === "" || (job.company_name && job.company_name.toLowerCase().includes(filters.company.toLowerCase()))) &&   
        // Minimum salary filter - checks if job salary is at least the specified amount
        (filters.minSalary === "" || (job.min_salary && job.min_salary >= parseFloat(filters.minSalary))) &&
        // Maximum salary filter - checks if job salary is at most the specified amount
        (filters.maxSalary === "" || (job.max_salary && job.max_salary <= parseFloat(filters.maxSalary))) &&
        // Experience level filter - matches required experience level
        (filters.formatted_experience_level === "" || (job.formatted_experience_level && job.formatted_experience_level.toLowerCase().includes(filters.experience_level.toLowerCase()))) &&
        // Search query filter - checks if job title includes the search query
        (searchQuery === "" || job.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    /**
     * Pagination logic
     * 
     * Calculates the current page of jobs to display based on the current page number
     * and the number of jobs per page. Also calculates the total number of pages.
     */
    const pagesPerSet = 10;
    const currentSet = Math.floor((currentPage - 1) / pagesPerSet);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const startPage = currentSet * pagesPerSet + 1;
    const endPage = Math.min(startPage + pagesPerSet - 1, totalPages);

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    // Get only the jobs for the current page
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    // Calculate total number of pages based on filtered jobs count
    // const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    /**
     * Handle page change when user clicks pagination controls
     * 
     * @param {number} newPage - The page number to navigate to
     */
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) return <p>Loading jobs. Please be patient!</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <FilterContext.Provider value={{ filters, setFilters }}>
            <div className="container py-4">
                <h1 className="mb-4 lato-bold">Job Listings</h1>
                {/* Search Bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by job title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
                <div className='row'>
                    {/* Sidebar for filters */}
                    <div className='col-md-2'>
                        <FilterControls />
                    </div>
                    {/* Job Listings */}
                    <div className='col-md-10'>
                        <div className='list-group mb-4'>
                            {currentJobs.map((job) => (
                                <div key={job.job_id} className='list-group-item job-list-item'>
                                    <h5>
                                        <Link to={`/job/${job.job_id}`} className='job-title'>{job.title}</Link>
                                    </h5>
                                    <p><strong>{job.company_name}</strong> - {job.location}</p>
                                    <p>
                                        <strong>Salary: </strong> 
                                        {formatSalary(parseFloat(job.min_salary), job.currency)} - {formatSalary(parseFloat(job.max_salary), job.currency)} {job.pay_period}
                                    </p>
                                    <p>{job.description.substring(0, 200)}...</p>
                                    <div className="d-flex gap-2 mt-2">
                                        <a href={job.job_posting_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                                            Apply Now
                                        </a>
                                        <SaveJobButton
                                        className="btn btn-primary btn-sm"
                                        jobData={{
                                            id: job.job_id,
                                            title: job.title,
                                            company: job.company_name,
                                            location: job.location,
                                            salary: `${job.currency} ${job.min_salary} - ${job.max_salary} ${job.pay_period}`,
                                            url: job.job_posting_url
                                        }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Pagination Controls */}
                        
                        <nav aria-label="Pagination">
                            <ul className="pagination justify-content-center custom-pagination">
                                {startPage > 1 && (
                                    <li className="page-item">
                                        <button className="page-link" onClick={() => handlePageChange(startPage - 1)}>&laquo;</button>
                                    </li>
                                )}
                                {Array.from({ length: endPage - startPage + 1 }, (_, index) =>(
                                    <li key={startPage + index} className={`page-item ${currentPage === startPage + index ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => handlePageChange(startPage + index)}>
                                            {startPage + index}
                                        </button>
                                    </li>
                                ))}
                                {endPage < totalPages && (
                                    <li className="page-item">
                                        <button className="page-link" onClick={() => handlePageChange(endPage + 1)}>&raquo;</button>
                                    </li>
                                )}
                            </ul>
                        </nav>
                        {/* <nav aria-label="Job listings pagination">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}  disabled={currentPage === 1}>
                                        Previous
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav> */}
                    </div>
                </div>
            </div>
        </FilterContext.Provider>
    );
};

/**
 * FilterControls Component
 * 
 * A sidebar component that provides UI controls for filtering the job listings.
 * Uses the FilterContext to access and update the filter state from the parent JobList component.
 * Includes controls for filtering by company, location, work type, salary range, and experience level.
 * 
 * @returns {JSX.Element} The rendered filter controls
 */
const FilterControls = () => {
    // Access the filter state and setter from context
    const { filters, setFilters } = useContext(FilterContext);
    // State to track whether filters are expanded or collapsed (for mobile view)
    const [expanded, setExpanded] = useState(false);
  
    /**
     * Toggle the expanded state of the filter controls
     */
    const handleToggle = () => setExpanded(!expanded);

    const resetFilters = () => {
        setFilters({
            location: "",
            company: "",
            formatted_work_type: "",
            minSalary: "",
            maxSalary: "",
            experience_level: ""
        });
    };
  
    return (
      <div className="filter-container">
          {/* Toggle Filters Button */}
          <button className="filter-toggle" onClick={handleToggle}>{expanded ? "- Filters" : "+ Filters"}</button>
          {expanded && (
          <div className="filter-options">
              {/* Company name filter */}
              <label className="label">
                  Company:
                  <input
                    type='text'
                    name='company'
                    value={filters.company}
                    onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                    className="input-field"
                    placeholder='Enter company name'
                  />
              </label>
              {/* Location Dropdown */}
              <label className="label">
                  Location:
                  <select 
                      name='location' 
                      value={filters.location} 
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      className="dropdown"
                  >
                    <option value="">All Locations</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </select>
              </label>
              
              {/* Min Salary Filter */}
              <label className="label">
                  Min Salary:
                  <input
                      type="number"
                      name="minSalary"
                      value={filters.minSalary}
                      onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                      className="input-field"
                      placeholder="Enter minimum salary"
                  />
              </label>
  
              {/* Max Salary Filter */}
              <label className="label">
                  Max Salary:
                  <input
                      type="number"
                      name="maxSalary"
                      value={filters.maxSalary}
                      onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
                      className="input-field"
                      placeholder="Enter maximum salary"
                  />
              </label>

              {/* Work experience Dropdown */}
              <label className="label">
                Work Experience:
                <select 
                    name='experience_level' 
                    value={filters.experience_level} 
                    onChange={(e) => setFilters({ ...filters, experience_level: e.target.value })}
                    className="dropdown"
                >
                    <option value="">All types</option>
                    <option value="Entry level">Entry</option>
                    <option value="Mid level">Mid</option>
                    <option value="Senior level">Senior</option>
                </select>
            </label>

            {/* Reset Filters Button */}
            <button className="btn btn-secondary mt-3" onClick={resetFilters}>
                  Reset Filters
            </button>

          </div>
      )}
  </div>
  
    );
  };
export default JobList;