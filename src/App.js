import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

// Carga diferida de los componentes para mejorar rendimiento
const Login = lazy(() => import("./pages/Login"));
const View = lazy(() => import("./pages/View"));
const Admin = lazy(() => import("./pages/Admin"));

function App() {
  // Obtener estado de autenticación (puedes mejorarlo con Context o Redux)
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
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
    </Suspense>
  );
}

export default App;
