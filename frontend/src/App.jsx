import { useState } from "react";
import PasswordTable from "./components/table/table";
import { Routes, Route } from "react-router-dom";
import Login from "./components/forms/login";
import Register from "./components/forms/register";
import { useUser } from "./context/userContext";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Profile from "./pages/profile";
import AddPassword from "./components/addPassword/addPasswor";
import { ToastContainer } from "react-toastify";

function App() {
  const { currentUser, updateUser } = useUser();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    updateUser(null);
    console.log(currentUser);
    navigate("/sign-in");
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    
      <Navbar bg="light" variant="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">SecurifyMe</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/profile")}>Profile</Nav.Link>
              <Nav.Link onClick={() => handleLogout()}>{currentUser? <>Logout</> : <>LogIn</>}</Nav.Link>
            </Nav>
            {currentUser && (
              <Button variant="primary" onClick={handleShowModal}>
                Add Password
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <AddPassword showModal={showModal} handleClose={handleCloseModal} />
      <Routes>
        <Route path="/" element={<PasswordTable />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
