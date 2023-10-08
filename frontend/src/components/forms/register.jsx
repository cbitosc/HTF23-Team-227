/* eslint-disable no-unused-vars */
import axios from "axios";
import * as Constant from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";

const Register = () => {
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
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    console.log(user);

    axios
      .post(Constant.api + "/user/register", user, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        if (response.status == 200) {
          // notifySuccess("login Successfull")
          navigate("/sign-in");
          console.log("SignUp Success");
        }
        console.log(response);
      })
      .catch(function (error) {
        // notifyError("user creation encountered an error");
        console.log(error);
      });
    setLoading(false);
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
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-center">Sign Up</h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                          Username:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          placeholder="Username"
                          onChange={handleChange}
                          name="username"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email address:
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Email"
                          onChange={handleChange}
                          name="email"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Password:
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="******************"
                          onChange={handleChange}
                          name="password"
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Sign Up
                      </button>
                    </form>
                  </div>
                  <div className="card-footer text-muted text-center">
                    Already have an account?{" "}
                    <a
                      onClick={() => {
                        navigate("/sign-in");
                      }}
                    >
                      Login
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Register;
