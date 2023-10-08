import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useUser } from "../context/userContext";
import axios from "axios";
import Swal from "sweetalert2";

const Profile = () => {
  const { currentUser, updateUser } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };
  const handleSaveChanges = () => {
    console.log("New Password:", newPassword);
    axios
      .put(`http://localhost:3001/user/update/${currentUser._id}`, {
        source: currentUser.source,
        email: currentUser.email,
        password: newPassword,
      })
      .then((response) => {
        console.log(response);
        updateUser(response.data);

        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text: "Your password has been updated successfully!",
        });
      })
      .catch((error) => {
        console.log(error);

        // Display an error message with SweetAlert2
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while updating your password.",
        });
      });

    // Close the modal
    handleCloseModal();
  };

  return (
    <>
    {currentUser? <><div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="user-profile">
              <div className="user-avatar-container">
                <div className="user-avatar">U</div>
                <h2>{currentUser.username}</h2>
              </div>
              <p>
                <strong>Email:</strong> {currentUser.email}
              </p>
              <hr />
              <div className="user-detail-container">
                <p>
                  <strong>Joined:</strong>{" "}
                  {currentUser.registrationDate.substring(0, 10)}
                </p>
              </div>

              <button
                className="btn btn-danger mt-3"
                onClick={handleShowModal}
                id="deleteAccountBtn"
              >
                Reset password
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={newPassword}
                onChange={handlePasswordChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal></> : <>
        login
      </>}
      
    </>
  );
};

export default Profile;
