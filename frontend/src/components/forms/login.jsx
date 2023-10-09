/* eslint-disable no-unused-vars */
import axios from "axios";
import * as Constant from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../context/userContext";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";

const Login = () => {
  const { currentUser, updateUser } = useUser();
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
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    console.log(user);
    axios
      .post(Constant.api + "/user/login", user, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        if (response.status == 200) {
          updateUser(response.data);
          // notifySuccess("login Successfull")
          console.log(currentUser);
          console.log(response.data);
          console.log("login Success");
          setLoading(false)
          navigate("/");
        }
      })
      .catch(function (error) {
        console.log(error);
        // notifyError("user login encountered an error");
        setLoading(false)

      });
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
          {" "}
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title text-center">Login</h3>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Enter your email"
                          onChange={handleChange}
                          name="email"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Password
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
                        Login
                      </button>
                    </form>
                    <p className="text-center">
                      Don&apos;t have an account?{" "}
                      <a
                        onClick={() => {
                          navigate("/sign-up");
                        }}
                      >
                        Sign Up
                      </a>
                    </p>
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

export default Login;
