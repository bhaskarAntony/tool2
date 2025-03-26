import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import AuthContext from '../../components/context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);

 

  const handleContinue = () => {
    if (email) {
      // Navigate to the next page with email as a route parameter
      navigate(`/SignIn_VerifyPassword`, { state: { email:email } });
    } else {
      setIsError(true)
    }
  };

  return (
    <section className="container-fluid p-3 p-md-5">
      <div className="row login">
        <div className="col-md-5">
          <div className="login-card p-2 text-center p-4 border rounded">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seal_of_Karnataka.svg/800px-Seal_of_Karnataka.svg.png"
              alt="Seal of Karnataka"
            />
            <h1 className="fs-4 fw-bold mt-3">Welcome to KSP Armoury</h1>
            <p className="fs-6">Enter your login details to continue</p>

            <div className="form-group mt-2 text-start">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="text"
                id="email"
                placeholder="Please enter email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            {
                isError?(
                    <span className="text-danger">Please enter valid email</span>
                ):(null)
            }
            </div>
            <button className="blue-btn w-100 mt-3" onClick={handleContinue}>
              Continue
            </button>
            <p className="mt-3 text-secondary text-start">
              Don’t have an account? <Link to="/">Request access</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
