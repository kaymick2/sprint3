import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from '@aws-amplify/auth';
import './NavBar.css';

/**
 * Navbar Component
 * 
 * A responsive navigation bar component that provides site-wide navigation and search functionality.
 * Uses Bootstrap for styling and responsive behavior.
 * 
 * Features:
 * - Responsive navigation menu with hamburger toggle for mobile
 * - Navigation links to different sections of the application
 * - Search functionality (currently commented out/in development)
 */
function Navbar() {
  const { user, signOut } = useAuthenticator((context) => [context.user, context.signOut]);
  const [userAttributes, setUserAttributes] = useState(null);

  useEffect(() => {
    // Load Bootstrap JavaScript bundle for navbar functionality
    import('bootstrap/dist/js/bootstrap.bundle.min.js');

    // Fetch user attributes when user is authenticated
    if (user) {
      fetchUserAttributes()
        .then(attributes => {
          setUserAttributes(attributes);
        })
        .catch(err => {
          console.error('Failed to fetch user attributes:', err);
        });
    }
  }, [user]);

  return (
    <nav className="navbar navbar-expand-lg navbar-customcolor fixed-top">
      <div className="container-fluid">
        {/* Brand/logo link */}
        <Link className="navbar-brand lato-bold" to="/">JobSearch Home</Link>

        {/* Mobile menu toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible navigation content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto lato-regular">
            <li className="nav-item">
              <Link className="nav-link" to="/jobs">Full Time Positions</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reu-sites">REU Research Opportunities</Link>
            </li>
          </ul>

          {/* Authentication Links */}
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <Link to="/profile" className="text-white me-3">Profile</Link>
                <span className="text-white me-2">Hello, {userAttributes?.name || user.username}</span>
                <button className="btn btn-danger" onClick={signOut}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/auth" className="btn btn-primary me-2">Sign In / Sign Up</Link>
                <Link to="/employer-auth" className="btn btn-outline-light">Employer</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
