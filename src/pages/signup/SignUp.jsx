import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../components/context/AuthContext';

function SignUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)

  const { login, isAuthenticated, error, clearErrors, loading } = useContext(AuthContext);

  const [passwordType, setPasswordType] = useState('password'); // Toggle password visibility
  const [formData, setFormData] = useState({ 
    adminemail:  '', 
    password: '' 
  });

  const { adminemail, password } = formData;

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordType((prevType) => (prevType === 'password' ? 'text' : 'password'));
  };

  // Handle form data changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    const result = await login({ adminemail, password });

    if (result) {
      setIsLoading(false)
      navigate('/');
    }else{
      setIsLoading(false);
    }
  };

  // // Handle authentication and error side-effects
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/'); // Redirect to the dashboard after successful login
  //   }
  //   if (error) {
  //     alert(error.message);
  //     clearErrors();
  //   }
  // }, [isAuthenticated, error, navigate, clearErrors]);

  // useEffect(()=>{
  //   window.location.reload()
  // })
  return (
    <section className="container-fluid p-3 p-md-5 signup">
      <div className="signup-top">
        <div className="row">
          <div className="col-md-5 m-auto">
            <div className="login-card p-2 p-md-4 text-center border rounded">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seal_of_Karnataka.svg/800px-Seal_of_Karnataka.svg.png"
                alt="Seal of Karnataka"
              />
              <h1 className="fs-4 fw-bold mt-3">Karnataka State Police <br /> Armoury Management Portal</h1>

              {/* <h1 className="fs-4 fw-bold mt-3">Great to see you</h1>
              <p className="small text-secondary" title={adminemail}>
                {adminemail}{' '}
                <Link to="/login" className="text-secondary" title="Edit email">
                  <i className="bi bi-pencil-fill"></i>
                </Link>
              </p> */}

              <form onSubmit={handleSubmit}>
              <div className="form-group mt-2 text-start">
              <label htmlFor="email" className="form-label">Admin Email</label>
              <input
                type="text"
                id="email"
                placeholder="Please enter email"
                className="form-control"
                name='adminemail'
                value={formData.adminemail}
                onChange={handleChange}
              />
            </div>
                <div className="form-group mt-2 text-start">
                  <label htmlFor="password" className="form-label">
                    Please enter your password
                  </label>
                  <input
                    type={passwordType}
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Please enter password"
                    className="form-control mb-2"
                  />
                  <label>
                    <input
                      type="checkbox"
                      className="mt-2"
                      onChange={togglePasswordVisibility}
                    />{' '}
                    Show password
                  </label>
                </div>
                <button
                  type="submit"
                  className="blue-btn w-100 mt-3"
                  disabled={loading}
                >
                  {loading || isLoading ? 'Please wait...' : 'Next'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="information text-center mt-5 text-secondary">
        <p className="small pb-3 border-bottom border-secondary">
          <span className="text-danger"> WARNING:</span> <br />
          This application KSP Armoury Management Portal is available only for
          authorized users. If you are not an authorized user, please disconnect
          the <br /> session by closing the browser immediately. By accessing
          this system, you agree that your actions may be monitored if <br />{' '}
          unauthorized usage is suspected.
        </p>
        <p className="small">&copy; Copyright {new Date().getFullYear()}</p>
      </div>
    </section>
  );
}

export default SignUp;
