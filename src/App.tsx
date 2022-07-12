import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";

import "./App.css";
import Navigation from "./components/navigation/navigation.component";
import Authentication from "./routes/authentication/authentication.component";
import Journal from "./routes/journal/journal.component";
import Admin from "./routes/admin/admin.component";
import AdminReport from "./routes/admin/report.component";
import { UserContext } from "./contexts/user.context";
import { UserData } from "./contexts/user.context";

function App() {
  const { state } = useContext(UserContext);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route
            path="journal"
            element={
              <RequireAuth currentUser={state}>
                <Journal />
              </RequireAuth>
            }
          />
          <Route
            path="auth"
            element={
              <NotRequireAuth currentUser={state}>
                <Authentication />
              </NotRequireAuth>
            }
          />
          <Route
            path="admin"
            element={
              <RequireAdminAuth currentUser={state}>
                <Admin />
              </RequireAdminAuth>
            }
          />
          <Route
            path="admin-report"
            element={
              <RequireAdminAuth currentUser={state}>
                <AdminReport />
              </RequireAdminAuth>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

type AuthProps = {
  children: JSX.Element;
  currentUser: UserData;
};

function RequireAuth({ children, currentUser }: AuthProps) {
  let location = useLocation();

  if (currentUser == null || Object.keys(currentUser).length === 0) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

function RequireAdminAuth({ children, currentUser }: AuthProps) {
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

function NotRequireAuth({ children, currentUser }: AuthProps) {
  if (currentUser != null && Object.keys(currentUser).length > 0) {
    return <Navigate to="/journal" />;
  }

  return children;
}

export default App;
