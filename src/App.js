import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";

import "./App.css";
import { UserContext } from "./contexts/user.context";
import Navigation from "./components/navigation/navigation.component";
import Authentication from "./routes/authentication/authentication.component";
import Journal from "./routes/journal/journal.component";
import Admin from "./routes/admin/admin.component";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route
            path="journal"
            element={
              <RequireAuth>
                <Journal />
              </RequireAuth>
            }
          />
          <Route
            path="auth"
            element={
              <NotRequireAuth>
                <Authentication />
              </NotRequireAuth>
            }
          />
          <Route
            path="auth"
            element={
              <RequireAdminAuth>
                <Admin />
              </RequireAdminAuth>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

function RequireAuth({ children }) {
  const { currentUser } = useContext(UserContext);
  let location = useLocation();

  if (currentUser == null) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

function RequireAdminAuth({ children }) {
  const { currentUser } = useContext(UserContext);
  let location = useLocation();

  if (currentUser == null || currentUser) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

function NotRequireAuth({ children }) {
  const { currentUser } = useContext(UserContext);

  if (currentUser != null) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/journal" />;
  }

  return children;
}

export default App;
