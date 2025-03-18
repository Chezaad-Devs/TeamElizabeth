// import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import View from "./pages/View";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="login" element={<Login />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="teamelizabethmartinez"
        element={
          <ProtectedRoute>
            <View />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
