import React, { useEffect, useState } from "react";
import { IoLogOut } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaMinus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { GrStatusGoodSmall } from "react-icons/gr";

function Homepage() {
  const navigate = useNavigate();
  const [selectedOrderType, setSelectedOrderType] = useState("tests");
  const [addTestModel, setAddTestModel] = useState(false);
  const [testName, setTestName] = useState("");
  const [testPrice, setTestPrice] = useState("");
  const [outputs, setOutputs] = useState([""]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [tests, setTests] = useState([]);

  const selectOrderType = (type) => {
    setSelectedOrderType(type);
  };

  const openAddTestModel = () => {
    setAddTestModel(true);
  };

  const closeAddTestModel = () => {
    setAddTestModel(false);
  };

  const logout = () => {
    Cookies.remove("user_type");
    Cookies.remove("user_id");
    navigate("/");
    window.location.reload();
  };

  const handleOutputChange = (index, value) => {
    console.log("output index: ", index + ", value: ", value);
    const newOutputs = [...outputs];
    newOutputs[index] = value;
    setOutputs(newOutputs);
  };

  const handleAddOutput = () => {
    setOutputs([...outputs, ""]);
  };

  const handleRemoveOutput = (index) => {
    const newOutputs = [...outputs];
    newOutputs.splice(index, 1);
    setOutputs(newOutputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (testName === "" || testPrice === "" || outputs === "") {
        return toast("Please fill all fields", { type: "error" });
      }
      const response = await axios.post("http://localhost:8000/tests/add", {
        testName,
        testPrice,
        status: "active",
        outputs,
      });
      if (response.status === 201) {
        toast.success("Adding New Test Successful", {
          position: "top-right",
          autoClose: 5000,
        });
      } else if (response.status === 409) {
        toast.error("Test already added", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      return toast("Test Already Added", { type: "error" });
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/orders/get-all")

      .then((res) => {
        setOrders(res.data.orders);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/user/get-all")

      .then((res) => {
        setUsers(res.data.users);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/tests/get-all")

      .then((res) => {
        console.log("tests", res.data.tests);
        setTests(res.data.tests);
      });
  }, []);

  return (
    <div>
      <ToastContainer />
      <div className="homepage-icons">
        <div className="icon-background" onClick={() => logout()}>
          <IoLogOut />
        </div>
      </div>
      <div className="container">
        <h2 className="page-heading">Admin Dashboard</h2>
        <div className="order-container">
          <div className="btn-group" role="group">
            <a
              className="btn btn-dark order-type-btn"
              onClick={() => selectOrderType("tests")}
            >
              All Tests
            </a>
            <a
              className="btn btn-dark order-type-btn"
              onClick={() => selectOrderType("orders")}
            >
              All Orders
            </a>
            <a
              className="btn btn-dark order-type-btn"
              onClick={() => selectOrderType("customers")}
            >
              All Users
            </a>
            <a
              className="btn btn-dark order-type-btn"
              onClick={() => selectOrderType("info")}
            >
              Information
            </a>
          </div>
          <div className="order-table-container">
            {selectedOrderType === "tests" ? (
              <div className="table-container">
                <h4 className="page-subheading">All Tests</h4>
                <div
                  className="icon-background"
                  onClick={() => openAddTestModel()}
                >
                  <FaPlus />
                </div>
                <table className="table">
                  <thead className="thead">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Test Name</th>
                      <th scope="col">Test Price</th>
                      <th scope="col">Outputs</th>
                      <th scope="col">Status</th>
                      <th scope="col">Created Date</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tests.map((val, index) => {
                      const eventDate = new Date(val.createdAt);
                      const dateOptions = { day: "numeric" };
                      const monthOptions = { month: "long" };
                      const formattedDay = eventDate.toLocaleDateString(
                        "en-US",
                        dateOptions
                      );
                      const formattedMonth = eventDate.toLocaleDateString(
                        "en-US",
                        monthOptions
                      );

                      return (
                        <tr>
                          <th scope="row">{index}</th>
                          <td>{val.testName}</td>
                          <td>{val.testName}</td>
                          <td>{val.outputs}</td>
                          <td>
                            {val.status === "active" ? (
                              <div className="status-good">
                                <GrStatusGoodSmall />
                              </div>
                            ) : (
                              <div className="status-bad">
                                <GrStatusGoodSmall />
                              </div>
                            )}
                          </td>
                          <td>
                            {formattedMonth} {formattedDay},{" "}
                            {eventDate.getFullYear()}
                          </td>
                          <td>
                            <a href="#">Review</a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
            {selectedOrderType === "orders" ? (
              <div className="table-container">
                <h4 className="page-subheading">All Orders</h4>
                <table className="table">
                  <thead className="thead">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Customer Name</th>
                      <th scope="col">Company Email</th>
                      <th scope="col">Customer Email</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Status</th>
                      <th scope="col">Created Date</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((val, index) => {
                      const eventDate = new Date(val.createdAt);
                      const dateOptions = { day: "numeric" };
                      const monthOptions = { month: "long" };
                      const formattedDay = eventDate.toLocaleDateString(
                        "en-US",
                        dateOptions
                      );
                      const formattedMonth = eventDate.toLocaleDateString(
                        "en-US",
                        monthOptions
                      );

                      return (
                        <tr>
                          <th scope="row">{index}</th>
                          <td>{val.customerName}</td>
                          <td>{val.companyEmail}</td>
                          <td>{val.contactPersonEmail}</td>
                          <td>{val.totalAmount}</td>
                          <td>
                            {val.status === "Completed" ? (
                              <div className="status-good">
                                <GrStatusGoodSmall />
                              </div>
                            ) : val.status === "Pending" ? (
                              <div className="status-progress">
                                <GrStatusGoodSmall />
                              </div>
                            ) : (
                              <div className="status-bad">
                                <GrStatusGoodSmall />
                              </div>
                            )}
                          </td>
                          <td>
                            {formattedMonth} {formattedDay},{" "}
                            {eventDate.getFullYear()}
                          </td>
                          <td>
                            <a href="#">Review</a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
            {selectedOrderType === "customers" ? (
              <div className="table-container">
                <h4 className="page-subheading">All Customers</h4>
                <table className="table">
                  <thead className="thead">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Type</th>
                      <th scope="col">Customer Name</th>
                      <th scope="col">Contact Person Name</th>
                      <th scope="col">Contact Person Email</th>
                      <th scope="col">Company Email</th>
                      <th scope="col">Remarks</th>
                      <th scope="col">Joined Date</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((val, index) => {
                      const eventDate = new Date(val.createdAt);
                      const dateOptions = { day: "numeric" };
                      const monthOptions = { month: "long" };
                      const formattedDay = eventDate.toLocaleDateString(
                        "en-US",
                        dateOptions
                      );
                      const formattedMonth = eventDate.toLocaleDateString(
                        "en-US",
                        monthOptions
                      );

                      return (
                        <tr>
                          <th scope="row">{index}</th>
                          <td>
                            {val.type === "admin" ? (
                              <div style={{ color: "red", fontWeight: "600" }}>
                                Admin
                              </div>
                            ) : val.type === "staff" ? (
                              <div
                                style={{
                                  color: "rgb(255, 145, 0)",
                                  fontWeight: "600",
                                }}
                              >
                                Staff
                              </div>
                            ) : (
                              <div
                                style={{ color: "green", fontWeight: "600" }}
                              >
                                Customer
                              </div>
                            )}
                          </td>
                          <td>{val.customerName}</td>
                          <td>{val.contactPersonName}</td>
                          <td>{val.contactPersonEmail}</td>
                          <td>{val.companyEmail}</td>
                          <td>{val.remarks}</td>
                          <td>
                            {formattedMonth} {formattedDay},{" "}
                            {eventDate.getFullYear()}
                          </td>
                          <td>
                            <a href="#">Review</a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
            {selectedOrderType === "info" ? (
              <div className="table-container">
                <h4 className="page-subheading">Panel goes here...</h4>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {addTestModel && (
        <div className="add-order-model">
          <form className="form add-order-form">
            <div className="row-container">
              <h4 className="page-subheading">Add Test</h4>
              <IoIosCloseCircleOutline
                className="popup-model-closer"
                onClick={closeAddTestModel}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Test Name</label>
              <input
                type="text"
                className="form-control add-order-form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Test 01"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Test Price</label>
              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <div class="input-group-text">Rs.</div>
                </div>
                <input
                  type="text"
                  class="form-control"
                  id="inlineFormInputGroup"
                  placeholder="Username"
                  value={testPrice}
                  onChange={(e) => setTestPrice(e.target.value)}
                />
                <div class="input-group-prepend">
                  <div class="input-group-text">/= only</div>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Outputs</label>
              {outputs.map((output, index) => (
                <div key={index}>
                  <input
                    className="form-control test-outputs-form-control"
                    type="text"
                    value={output}
                    onChange={(e) => handleOutputChange(index, e.target.value)}
                  />
                  <FaMinus
                    className="minus-icon"
                    onClick={() => handleRemoveOutput(index)}
                  />
                </div>
              ))}
              <div className="icon-background" onClick={handleAddOutput}>
                <FaPlus />
              </div>
            </div>
            <a className="btn btn-primary" onClick={handleSubmit}>
              Add Test
            </a>
          </form>
        </div>
      )}
    </div>
  );
}

export default Homepage;
