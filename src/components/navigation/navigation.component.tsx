import { Fragment, useContext } from "react";
import { Outlet } from "react-router-dom";

import { UserContext } from "../../contexts/user.context";

import { signOutUser } from "../../utils/firebase/firebase.util";
import { Navbar, Container, Nav } from "react-bootstrap";

const Navigation = () => {
  const { state } = useContext(UserContext);

  return (
    <Fragment>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="">Calories App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/journal">Caloric Journal</Nav.Link>
              {!(state && Object.keys(state).length === 0) ? (
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
              {state && state.role === "admin" && (
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
