import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import "./App.css";
import Navigation from "./components/navigation/navigation.component";
import Authentication from "./routes/authentication/authentication.component";
import Journal from "./routes/journal/journal.component";
import Admin from "./routes/admin/admin.component";
import AdminReport from "./routes/admin/report.component";
import { UserData } from "./contexts/user.context";
import { selectCurrentUser } from "./store/user/user.selector";
import { useDispatch, useSelector } from "react-redux";
import {
  createUserDocumentFromAuth,
  getUserDoc,
  onAuthStateChangedListener,
} from "./utils/firebase/firebase.util";
import { DocumentData } from "firebase/firestore";
import { setCurrentUser } from "./store/user/user.action";

function App() {
  // const { state } = useContext(UserContext);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user: UserData) => {
      let userData;
      if (user) {
        await createUserDocumentFromAuth(user);
        const userDoc: DocumentData | undefined = await getUserDoc(user);
        if (userDoc !== undefined) {
          userData = {
            ...user,
            dailyCalorieLimit: userDoc.dailyCalorieLimit,
            role: userDoc.role,
          };
        }
      }
      console.log("dispatched");
      dispatch(
        setCurrentUser({
          ...userData,
        } as UserData)
      );
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
