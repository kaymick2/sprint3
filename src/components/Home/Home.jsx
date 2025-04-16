import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import '/src/App.css';
import './Carousel.css';
import SaveJobButton from '../Profile/SaveJobButton';

/*
 * Home Component
 * 
 * Landing page component that displays a welcome message and image carousel.
 * Uses React Bootstrap for the carousel implementation.
 * 
 * Features:
 * - Responsive image carousel with auto-rotation
 * - Welcome message and testimonial
 * - Featured jobs section with 3 random jobs fetched from API
 * - Bootstrap-based layout and styling
 */
function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);

  // Fetch 3 random jobs from API
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await fetch(
          'https://ixmv8lw2lj.execute-api.us-east-2.amazonaws.com/linkedinDB/reading'
        );
        const data = await response.json();
        const jobsArray = Array.isArray(data.body) ? data.body : [];

        // Shuffle and select 3 random jobs
        const randomJobs = jobsArray.sort(() => 0.5 - Math.random()).slice(0, 3);
        setFeaturedJobs(randomJobs);
      } catch (error) {
        console.error('Failed to fetch featured jobs:', error);
      }
    };

    fetchFeaturedJobs();
  }, []);

  return (
    <div>
      {/* Image carousel section with overlay text */}
      <div className="carousel-container position-relative">
        <Carousel data-bs-ride="carousel">
          {/* First slide - Group work image */}
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/assets/groupwork.jpg" alt="First slide" />
          </Carousel.Item>
          {/* Second slide - Office image */}
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/assets/office.jpg" alt="Second slide" />
          </Carousel.Item>
          {/* Third slide - Computer image */}
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/assets/computer.jpg" alt="Third slide" />
          </Carousel.Item>
        </Carousel>

        {/* Overlay title */}
        <div className="carousel-text">
          <h1 className="display-3 text-white fw-bold">JobSearch</h1>
        </div>
      </div>

      {/* Main content inside "container" */}
      <div className="container">
        {/* Title */}
        <div className="title">
          <h1>
            {/* You can add a heading here */}
          </h1>
        </div>

        {/* Welcome message section */}
        <div className="app-description">
          <p>
            {/* Welcome to JobSearch, your tool to browse jobs and apply with a click of a button.
            Create your profile today to find your next job! */}
          </p>
        </div>

        {/* Solid border */}
        <hr className="solid" style={{ margin: '0 0 15px 0' }} />

        {/* Testimonial section */}
        <div className="bio-description">
          <p>
            {/* "JobSearch was a game-changer for me! I landed my dream job in just two weeks." <br />
            - Emily S. */}
          </p>
        </div>

        <div className="bio-description">
          <p>
            {/* "To say JobSearch is amazing is an understatement. I highly recommend it to everyone looking for a job!" <br />
            - Alex F. */}
          </p>
        </div>

        {/* Featured Jobs Section */}
        <hr className="solid" style={{ margin: '15px 0' }} />
        <h2 className="mb-2">Featured Jobs</h2>
        <div className="row" style={{ marginTop: '10px' }}>
          {featuredJobs.map((job) => (
            <div className="col-md-4 mb-3" key={job.job_id}> {/* Reduced mb-4 to mb-3 for less spacing */}
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {job.company_name} — {job.location}
                  </h6>
                  <p className="card-text">
                    {job.description?.substring(0, 100)}...
                  </p>
                  <div className="d-flex gap-2">
                    <a
                      href={job.job_posting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Apply Now
                    </a>
                    <SaveJobButton className="btn btn-primary btn-sm" jobId={job.job_id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Home;


