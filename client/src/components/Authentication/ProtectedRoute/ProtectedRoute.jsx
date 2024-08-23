import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem("token");

  // Function to check if the token has expired
  const isTokenExpired = (token) => {
    if (!token) return true; // If no token, consider it expired

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds

      return decodedToken.exp < currentTime; // Return true if the token is expired
    } catch (error) {
      return true; // In case of error during decoding, assume the token is invalid/expired
    }
  };

  // Check if the user is authenticated and the token is not expired
  const isAuthenticated = token && !isTokenExpired(token);

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
