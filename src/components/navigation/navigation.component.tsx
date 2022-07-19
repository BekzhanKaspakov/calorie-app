import { Fragment, useContext } from "react";
import { Outlet } from "react-router-dom";

import { signOutUser } from "../../utils/firebase/firebase.util";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";

const Navigation = () => {
  // const { state } = useContext(UserContext);
  const currentUser = useSelector(selectCurrentUser);

  return (
    <Fragment>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="">Calories App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/journal">Caloric Journal</Nav.Link>
              {!(currentUser && Object.keys(currentUser).length === 0) ? (
                <Nav.Link
                  onClick={async () => {
                    localStorage.removeItem("user");
                    await signOutUser();
                    window.location.reload();
                  }}
                >
                  SIGN OUT
                </Nav.Link>
              ) : (
                <Nav.Link href="/auth">SIGN IN</Nav.Link>
              )}
              {currentUser && currentUser.role === "admin" && (
                <>
                  <Nav.Link href="/admin">Admin Page</Nav.Link>
                  <Nav.Link href="/admin-report">Admin Report</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
