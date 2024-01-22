import React, { useState } from "react";
import "./Styles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();

  const [contactPersonEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (contactPersonEmail === "" || password === "") {
        return toast("Please fill all fields", { type: "error" });
      }
      const response = await axios.post("http://localhost:8000/user/login", {
        contactPersonEmail,
        password,
      });

      if (response.status === 200) {
        Cookies.set("user_type", response.data.user.type, { expires: 1 / 24 });
        Cookies.set("user_id", response.data.user._id, { expires: 1 / 24 });
        if (response.data.user.type === "admin") {
          navigate("/admin/homepage");
          window.location.reload();
        } else if (response.data.user.type === "staff") {
          navigate("/staff/homepage");
          window.location.reload();
        } else if (response.data.user.type === "other") {
          navigate("/homepage");
          window.location.reload();
        } else {
          console.log("invalid");
          toast.error("Invalid User", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } else {
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during login:", error.message);
      return toast("Check the Inputs", { type: "error" });
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="row login-container">
        <div className="col-md-6"></div>
        <div className="col-md-6">
          <h2 className="page-heading">Login</h2>
          <form className="form" onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="abcd@gmail.com"
                value={contactPersonEmail}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="*****"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <div className="sub-text mt-5">
              Don't have an account? <a href="/register">Register here</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
