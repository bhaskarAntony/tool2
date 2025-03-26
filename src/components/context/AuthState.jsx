import React, { useEffect, useReducer } from "react";
import axios from "axios";
import authReducer from "./AuthReducer";
import setAuthToken from "../../utils/setAuthToken";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from "../../types";
import AuthContext from "./AuthContext";
import Loading from "../loading/Loading";

const AuthState = ({ children }) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    console.log(localStorage.token);
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get(`https://tool-backendf.onrender.com/api/admin/verify`);
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Register User
  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(`https://tool-backendf.onrender.com/api/admin/register`, formData, config);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      setAuthToken(res.data.token);
      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.message || "Registration failed",
      });
    }
  };

  
  const login = async (formData) => {
    try {
      const res = await axios.post(`https://tool-backendf.onrender.com/api/admin/login`, formData);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
  
      // Set token in localStorage
      localStorage.setItem("token", res.data.token);
  
      setAuthToken(res.data.token); // Set token for axios default headers
      loadUser();
      return true;
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response?.data?.message || "Login failed",
      });
    }
  };

  // Logout
  const logout = () => {
  localStorage.removeItem('token')
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  if(state.loading){
    return <Loading/>
  }

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearErrors,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;