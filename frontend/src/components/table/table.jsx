/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { toast } from "react-toastify";
import * as Constant from "../../utils/constants";

const PasswordTable = () => {
  const { currentUser } = useUser();
  const [passwords, setPasswords] = useState([]);
  const [show, setShow] = useState(false);
  const [row, setRow] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);

  const copyPasswordToClipboard = (password) => {
    const tempInput = document.createElement("input");
    tempInput.value = password;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    setIsCopied(true);
  };

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
  useEffect(() => {
    console.log(currentUser);
    if (currentUser) {
      axios
        .get(`http://localhost:3001/user/passwords?userId=${currentUser._id}`)
        .then((response) => {
          setPasswords(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);
  const handleClose = () => setShow(false);

  const handleShow = (row) => {
    setShow(true), setRow(row);
  };

  const handleUpdate = (row) => {
    console.log(1);
    console.log(row);
    if (row.password.length < 8) {
      alert("Password Length should be minimum 8");
      return;
    }
    axios
      .put(`http://localhost:3001/user/passwords/${row._id}`, {
        source: row.source,
        email: row.email,
        password: row.password,
      })
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          notifySuccess("Data Updated");
        }
      })
      .catch((error) => {
        console.log(error);
        notifyError("Something went wrong!");
      });
    handleClose();
    navigate(0);
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3001/user/passwords/${row._id}`)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
        navigate(0);
      }
    });
  };

  const handleChange = (e) => {
    setRow((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(row);
  };

  const togglePasswordDisplay = (itemId) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  const handleGeneratePassword = () => {
    let passwordLength = prompt("Please enter desize length");
    console.log(Constant.generatePassword(passwordLength));
    const newPassword = Constant.generatePassword(passwordLength);
    setRow({
      ...row,
      password: newPassword,
    });
  };

  return (
    <>
      {currentUser ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>Password</th>
                <th>Source</th>
                <th>Strength</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {passwords.map((item, index) => {
                let strengthClass = "";
                if (item.strength === "Too weak") {
                  strengthClass = "too-weak";
                } else if (item.strength === "Weak") {
                  strengthClass = "weak";
                } else if (item.strength === "Medium") {
                  strengthClass = "medium";
                } else if (item.strength === "Strong") {
                  strengthClass = "strong";
                }

                return (
                  <tr key={index} className={strengthClass}>
                    <td>{item.email}</td>
                    <td>
                      {showPasswords[item._id] ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span onClick={() => togglePasswordDisplay(item._id)}>
                            {item.password}
                          </span>
                          <span
                            className="copy-icon"
                            onClick={() => {
                              copyPasswordToClipboard(item.password);
                            }}
                          >
                            <i className="fa fa-copy"></i>
                          </span>
                        </div>
                      ) : (
                        <span onClick={() => togglePasswordDisplay(item._id)}>
                          Show Password
                        </span>
                      )}
                    </td>
                    <td>{item.source}</td>
                    <td>{item.strength}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic"></Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              handleShow(item);
                            }}
                          >
                            Update
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              handleDelete(item);
                            }}
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Update Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    name="email"
                    onChange={handleChange}
                    value={row.email}
                    autoFocus
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Source</Form.Label>
                  <Form.Control
                    id="source"
                    type="text"
                    placeholder="www.google.com"
                    name="source"
                    onChange={handleChange}
                    value={row.source}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    id="password"
                    // type="password"
                    placeholder="************"
                    name="password"
                    onChange={handleChange}
                    value={row.password}
                  />
                </Form.Group>
                <Button
                  variant="secondary"
                  onClick={() => handleGeneratePassword()}
                >
                  Generate one
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleUpdate(row);
                }}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <>LogIn</>
      )}
    </>
  );
};

export default PasswordTable;
