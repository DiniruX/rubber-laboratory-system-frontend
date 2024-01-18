import React, { useState } from "react";
import "../Styles.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Registration() {
  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    type: "",
    companyPhoneNumber: "",
    companyEmail: "",
    contactPersonName: "",
    contactPersonPhoneNumber: "",
    contactPersonEmail: "",
    remarks: "",
    password: "",
  });

  const [reEnterPassword, setReEnterPassword] = useState("");

  const handleFormChange = (e) => {
    console.log("Updating state:", e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const demo = () => {
    setFormData({
      customerName: "Diniru Sandipa",
      address: "123 Main Street, Cityville",
      type: "admin",
      companyPhoneNumber: "5551234",
      companyEmail: "info@samplecompany.com",
      contactPersonName: "John Doe",
      contactPersonPhoneNumber: "5555678",
      contactPersonEmail: "diniru.admin@gmail.com",
      remarks: "Additional notes or comments",
      password: "1234",
    });
    setReEnterPassword("1234");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      if (
        formData?.customerName === "" ||
        formData?.address === "" ||
        formData?.companyPhoneNumber === "" ||
        formData?.companyEmail === "" ||
        formData?.contactPersonName === "" ||
        formData?.contactPersonPhoneNumber === "" ||
        formData?.contactPersonEmail === "" ||
        formData?.remarks === "" ||
        formData?.password === ""
      ) {
        return toast("Please enter all fields", { type: "error" });
      }

      if (formData?.password === reEnterPassword) {
        console.log("running register: ", formData);
        const response = await axios.post(
          "http://localhost:8000/user/register",
          formData
        );
        console.log("response: ", response);
        toast.success("Success! User has been added.", {
          position: "top-right",
          autoClose: 5000,
        });
        // navigate("/")
        // window.location.reload();
      } else {
        return toast("Passwords does not match", { type: "error" });
      }
    } catch (error) {
      console.error("An error occurred during register:", error.message);
      console.log("Error response:", error.response.data);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="container">
        <div className="row login-container">
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <h2 className="page-heading">Registration</h2>
            <form className="form" onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="kamal Perera"
                  value={formData.customerName}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="No 01, Galle Road, Colombo"
                  value={formData.address}
                  onChange={handleFormChange}
                />
              </div>
              <h6 className="card-title">Company Information</h6>
              <div className="mb-3">
                <label className="form-label">Company Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="0112 345 678"
                  value={formData.companyPhoneNumber}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Company Email</label>
                <input
                  type="email"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="abcd@gmail.com"
                  value={formData.companyEmail}
                  onChange={handleFormChange}
                />
              </div>
              <h6 className="card-title">Contact Person Information</h6>
              <div className="mb-3">
                <label className="form-label">Conatct Person Name</label>
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Kamal Perera"
                  value={formData.contactPersonName}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Conatct Person Phone Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="0772 345 678"
                  value={formData.contactPersonPhoneNumber}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Conatct Person Email</label>
                <input
                  type="email"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="abcd@gmail.com"
                  value={formData.contactPersonEmail}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Remarks</label>
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Any Special Note"
                  value={formData.remarks}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="*****"
                  value={formData.password}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Re-enter Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="*****"
                  value={reEnterPassword}
                  onChange={(e) => setReEnterPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
              &nbsp;
              <div className="sub-text mt-5">
                Already have an account? <a href="/">Login here</a>
              </div>
            </form>
            <button className="btn btn-success btn-sm" onClick={() => demo()}>
              demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
