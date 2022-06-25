import { Fragment, useContext } from "react";
import { Outlet, Link } from "react-router-dom";

import { UserContext } from "../../contexts/user.context";

import { signOutUser } from "../../utils/firebase/firebase.utils";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

import "./navigation.styles.scss";

const Navigation = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <Fragment>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Calories App</Navbar.Brand>
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
                <Nav.Link href="/admin">Admin Page</Nav.Link>
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
