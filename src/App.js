import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext, useState } from "react";

import "./App.css";
import Navigation from "./components/navigation/navigation.component";
import Authentication from "./routes/authentication/authentication.component";
import Journal from "./routes/journal/journal.component";
import Admin from "./routes/admin/admin.component";
import AdminReport from "./routes/admin/report.component";
import usePersistState from "./hooks/usePersistState.hook";
import { UserContext } from "./contexts/user.context";

function App() {
  const { currentUser } = useContext(UserContext);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route
            path="journal"
            element={
              <RequireAuth currentUser={currentUser}>
                <Journal />
              </RequireAuth>
            }
          />
          <Route
            path="auth"
            element={
              <NotRequireAuth currentUser={currentUser}>
                <Authentication />
              </NotRequireAuth>
            }
          />
          <Route
            path="admin"
            element={
              <RequireAdminAuth currentUser={currentUser}>
                <Admin />
              </RequireAdminAuth>
            }
          />
          <Route
            path="admin-report"
            element={
              <RequireAdminAuth currentUser={currentUser}>
                <AdminReport />
              </RequireAdminAuth>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

function RequireAuth({ children, currentUser }) {
  let location = useLocation();

  if (currentUser == null || Object.keys(currentUser).length === 0) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

function RequireAdminAuth({ children, currentUser }) {
  let location = useLocation();

  if (
    currentUser == null ||
    Object.keys(currentUser).length === 0 ||
    currentUser.role !== "admin"
  ) {
    return <Navigate to="/journal" state={{ from: location }} replace />;
  }

  return children;
}

function NotRequireAuth({ children, currentUser }) {
  if (currentUser != null && Object.keys(currentUser).length > 0) {
    return <Navigate to="/journal" />;
  }

  return children;
}

export default App;
