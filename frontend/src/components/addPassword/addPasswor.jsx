/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import * as Constant from "../../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { set } from "mongoose";

const AddPassword = ({ showModal, handleClose }) => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(false);

  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const notifyError = (message) =>
    toast.error(message, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const [data, setData] = useState({
    source: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    setLoading(true);
    if (data.password.length < 8) {
      setLoading(false);
      alert("Password Length should be minimum 8");
      return;
    }
    console.log(data);
    try {
      axios
        .post(
          Constant.api + `/user/passwords?userId=${currentUser._id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          if (response.status == 200) {
            console.log("Password Added");
            // notifySuccess("Password Added");
            navigate(0);
          }
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
          // notifyError("Something went wrong!");
        });
    } catch (error) {
      console.log(error);
    }

    setLoading(false);

    handleClose();
  };

  const handleGeneratePassword = () => {
    let passwordLength = prompt("Please enter desize length");
    if (passwordLength < 8) {
      return alert("Password Length should be minimum 8");
    }
    // console.log(Constant.generatePassword(passwordLength))
    const newPassword = Constant.generatePassword(passwordLength);
    console.log(newPassword);
    setData({
      ...data,
      password: newPassword,
    });
    console.log(data);
  };
  return (
    <>
      {loading ? (
        <>
          <div className="container mt-5">
            <div className="row justify-content-center">
              {" "}
              <ReactLoading
                type="balls"
                color="#ccc"
                height={"10%"}
                width={"10%"}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={data.email}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Source</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter source"
                    value={data.source}
                    name="source"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={data.password}
                    onChange={handleChange}
                  />
                  <Button
                    className="mt-1"
                    variant="secondary"
                    onClick={() => handleGeneratePassword()}
                  >
                    Generate one
                  </Button>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default AddPassword;
