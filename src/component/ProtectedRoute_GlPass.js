import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.REACT_APP_PASSWORD_GL) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (isAuthenticated) {
    return <Component {...rest} />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProtectedRoute;
