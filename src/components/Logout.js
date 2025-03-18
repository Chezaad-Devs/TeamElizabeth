import { Route, Navigate } from "react-router-dom";

const LogoutRoute = () => {
  localStorage.clear();
  return <Navigate to="/" />;
};

export default LogoutRoute;
