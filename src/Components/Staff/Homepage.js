import React, { useState, useEffect } from "react";
import { IoLogOut } from "react-icons/io5";
import axios from "axios";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StartUrl from "../../configs/Url.json";
import emailjs from "@emailjs/browser";

function Homepage() {
  const navigate = useNavigate();
  const [selectedOrderType, setSelectedOrderType] = useState("not_started");
  const [inProgOrders, setInProgOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [notStartedOrders, setNotStartedOrders] = useState([]);
  const [completeOrderModel, setCompleteOrderModel] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [outputValues, setOutputValues] = useState({});
  const [user, setUser] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const selectOrderType = (type) => {
    setSelectedOrderType(type);
  };

  const hideModel = () => {
    setCompleteOrderModel(false);
  };

  const showModel = () => {
    setCompleteOrderModel(true);
  };

  const logout = () => {
    Cookies.remove("user_type");
    Cookies.remove("user_id");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    axios
      .get(StartUrl?.StartUrl + "/orders/get-all")

      .then((res) => {
        const inProgorders = res.data.orders.filter(
          (order) => order.status === "in_progress"
        );
        setInProgOrders(inProgorders);
        const notStartedOrders = res.data.orders.filter(
          (order) => order.status === "not_started"
        );
        setNotStartedOrders(notStartedOrders);
        const completedOrders = res.data.orders.filter(
          (order) => order.status === "completed"
        );
        setCompletedOrders(completedOrders);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.log("No orders to display.");
        } else {
          console.error("Error fetching orders:", error.message);
        }
      });
  }, []);

  const fetchOrders = () => {
    try {
      axios
        .get(StartUrl?.StartUrl + "/orders/get-all")

        .then((res) => {
          const inProgorders = res.data.orders.filter(
            (order) => order.status === "in_progress"
          );
          setInProgOrders(inProgorders);
          const notStartedOrders = res.data.orders.filter(
            (order) => order.status === "not_started"
          );
          setNotStartedOrders(notStartedOrders);
          const completedOrders = res.data.orders.filter(
            (order) => order.status === "completed"
          );
          setCompletedOrders(completedOrders);
        });
    } catch (e) {
      console.error("An error occurred during order updating:", e.message);
    }
  };

  useEffect(() => {
    const id = Cookies.get("user_id");
    axios
      .get(StartUrl?.StartUrl + `/user/get-by-id/${id}`)

      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.log("User session timed out.");
          navigate("/");
        } else {
          console.error("Error fetching orders:", error.message);
        }
      });
  }, []);

  useEffect(() => {
    console.log("checked: ", isChecked);
  }, [isChecked]);

  const handleSelectedOrder = (id) => {
    try {
      axios
        .get(StartUrl?.StartUrl + `/orders/get-order/${id}`)

        .then((res) => {
          setSelectedOrder(res.data);
          console.log("selected order: ", res.data);
          showModel();
        });
    } catch (e) {
      console.error("No orders to display:", e.message);
    }
  };

  const handleInputChange = (
    outputIndex,
    testIndex,
    value,
    testName,
    price,
    outputName
  ) => {
    setOutputValues((prevValues) => {
      // Create a shallow copy of the existing outputValues
      const newValues = Array.isArray(prevValues) ? [...prevValues] : [];

      // Create or update the value for the corresponding test and output
      newValues[outputIndex] = newValues[outputIndex] || {};
      newValues[outputIndex].testName = testName;
      newValues[outputIndex].price = price;
      newValues[outputIndex].outputs = newValues[outputIndex].outputs || [];

      // Create or update the value for the corresponding output
      newValues[outputIndex].outputs[testIndex] =
        newValues[outputIndex].outputs[testIndex] || {};
      newValues[outputIndex].outputs[testIndex].outputName = outputName;
      newValues[outputIndex].outputs[testIndex].result = value;
      console.log(newValues);
      return newValues;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = selectedOrder._id;
    var updatedStatus = "";
    if (selectedOrder.status === "not_started") {
      var updatedStatus = "in_progress";
    } else if (selectedOrder.status === "in_progress") {
      if (isChecked) {
        var updatedStatus = "completed";
      } else {
        return alert("Please check the checkbox before submitting.");
      }
    }
    if (selectedOrder.status === "not_started") {
      if (Object.keys(outputValues).length === 0) {
        return toast("Unable to Continue", { type: "error" });
      }
      try {
        const data = {
          customerId: selectedOrder.customerId,
          customerName: selectedOrder.customerName,
          companyPhoneNumber: selectedOrder.companyPhoneNumber,
          contactPersonPhoneNumber: selectedOrder.contactPersonPhoneNumber,
          companyEmail: selectedOrder.companyEmail,
          contactPersonEmail: selectedOrder.contactPersonEmail,
          requiredTests: outputValues,
          totalAmount: selectedOrder.totalAmount,
          status: updatedStatus,
        };
        console.log("updated data: ", data);
        const response = await axios.put(
          StartUrl?.StartUrl + `/orders/update-order/${id}`,
          data
        );
        console.log("response: ", response);
        if (response.status === 200) {
          toast.success("Process Successful", {
            position: "top-right",
            autoClose: 5000,
          });
          setCompleteOrderModel(false);
          fetchOrders();
        }
      } catch (e) {
        console.error("An error occurred during order updating:", e.message);
      }
    } else if (selectedOrder.status === "in_progress") {
      try {
        const data = {
          status: updatedStatus,
        };
        console.log("updated data: ", data);
        const response = await axios.put(
          StartUrl?.StartUrl + `/orders/update-order-status/${id}`,
          data
        );
        console.log("response: ", response);
        if (response.status === 200) {
          toast.success("Process Successful", {
            position: "top-right",
            autoClose: 5000,
          });
          setCompleteOrderModel(false);
          fetchOrders();
        }
      } catch (e) {
        console.error("An error occurred during order updating:", e.message);
      }
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();

    const serviceId = "service_y4h1h0d";
    const templateId = "template_fjq1ten";
    const publicKey = "user_4Ty61vRi47OewtmEVjcGx";
    const templateParams = {
      order_id: selectedOrder._id,
      to_name: selectedOrder.customerName,
      created_date: selectedOrder.createdAt,
      user_email: selectedOrder.contactPersonEmail,
    };
    console.log("email params: ", templateParams);
    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        toast.success("Email Sent Successfully", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .catch((e) => {
        return toast("Error Sending Email", { type: "error" });
      });
  };

  return (
    <div>
      <ToastContainer />
      <div className="homepage-icons">
        <div className="icon-background" onClick={() => logout()}>
          <IoLogOut />
        </div>
      </div>
      <div className="container">
        <h2 className="page-heading">Customer Orders</h2>
        <div className="order-container">
          <div className="btn-group" role="group">
            <div
              className="btn btn-dark order-type-btn"
              onClick={() => selectOrderType("not_started")}
            >
              Not Started
            </div>
            <div
              className="btn btn-dark order-type-btn"
              onClick={() => selectOrderType("in_progress")}
            >
              In Progress
            </div>
            <div
              className="btn btn-dark order-type-btn"
              onClick={() => selectOrderType("completed")}
            >
              Completed
            </div>
          </div>
          <div className="order-table-container">
            {selectedOrderType === "not_started" ? (
              <div className="table-container">
                <h4 className="page-subheading">Not Started Orders</h4>
                <table className="table">
                  <thead className="thead">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Required Tests</th>
                      <th scope="col">Created Date</th>
                      <th scope="col">Customer Name</th>
                      <th scope="col">Contact Number</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notStartedOrders.map((val, index) => {
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
                          <th scope="row">{index + 1}</th>
                          <td>
                            {val.requiredTests.map((test, index) => (
                              <li>{test.testName}</li>
                            ))}
                          </td>
                          <td>
                            {formattedMonth} {formattedDay},{" "}
                            {eventDate.getFullYear()}
                          </td>
                          <td>{val.customerName}</td>
                          <td>{val.contactPersonPhoneNumber}</td>
                          <td>
                            <div
                              onClick={() => handleSelectedOrder(val._id)}
                              className="btn btn-warning btn-sm"
                            >
                              Start Working
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
            {selectedOrderType === "in_progress" ? (
              <div className="table-container">
                <h4 className="page-subheading">In Progress Orders</h4>
                <table className="table">
                  <thead className="thead">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Required Tests</th>
                      <th scope="col">Created Date</th>
                      <th scope="col">Customer Name</th>
                      <th scope="col">Contact Number</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inProgOrders.map((val, index) => {
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
                          <th scope="row">{index + 1}</th>
                          <td>
                            {val.requiredTests.map((test, index) => (
                              <li>{test.testName}</li>
                            ))}
                          </td>
                          <td>
                            {formattedMonth} {formattedDay},{" "}
                            {eventDate.getFullYear()}
                          </td>
                          <td>{val.customerName}</td>
                          <td>{val.contactPersonPhoneNumber}</td>
                          <td>
                            <div
                              className="btn btn-secondary"
                              onClick={() => handleSelectedOrder(val._id)}
                            >
                              Review
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
            {selectedOrderType === "completed" ? (
              <div className="table-container">
                <h4 className="page-subheading">Completed Orders</h4>
                <table className="table">
                  <thead className="thead">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Required Tests</th>
                      <th scope="col">Created Date</th>
                      <th scope="col">Customer Name</th>
                      <th scope="col">Contact Number</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedOrders.map((val, index) => {
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
                          <th scope="row">{index + 1}</th>
                          <td>
                            {val.requiredTests.map((test, index) => (
                              <li>{test.testName}</li>
                            ))}
                          </td>
                          <td>
                            {formattedMonth} {formattedDay},{" "}
                            {eventDate.getFullYear()}
                          </td>
                          <td>{val.customerName}</td>
                          <td>{val.contactPersonPhoneNumber}</td>
                          <td>
                            <button
                              className="btn btn-success"
                              onClick={() => handleSelectedOrder(val._id)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {completeOrderModel && (
        <div className="add-order-model">
          <form className="form add-order-form">
            <div className="row-container">
              <h4 className="page-subheading">Complete Order</h4>
              <IoIosCloseCircleOutline
                className="popup-model-closer"
                onClick={hideModel}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Order ID</label>
              <input
                type="text"
                className="form-control add-order-form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Admin 0912"
                value={selectedOrder._id}
                disabled
              />
            </div>
            {selectedOrder.status === "not_started" ? (
              <div className="mb-3">
                <h5>Required Tests</h5>
                {selectedOrder.requiredTests.map((value, outputIndex) => (
                  <div>
                    <div className="order-test-title">
                      <b> {value.testName}</b>
                    </div>
                    <h6>Outputs</h6>
                    <div>
                      {value.outputs.map((val, testIndex) => {
                        return (
                          <div className="mb-3 row">
                            <div className=" col-2 test-output-title">
                              {val.outputName}
                            </div>
                            <div className="col-10">
                              <input
                                type="text"
                                className="form-control add-order-form-control"
                                id={`exampleInputEmail1_${testIndex}`}
                                aria-describedby="emailHelp"
                                placeholder={val?.result || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    outputIndex,
                                    testIndex,
                                    e.target.value,
                                    value.testName,
                                    value.price,
                                    val.outputName
                                  )
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-3">
                <h5>Required Tests</h5>
                {selectedOrder.requiredTests.map((value, outputIndex) => (
                  <div>
                    <div className="order-test-title">
                      <b> {value.testName}</b>
                    </div>
                    <h6>Outputs</h6>
                    <div>
                      {value.outputs.map((val, testIndex) => {
                        return (
                          <div className="mb-3 row">
                            <div className=" col-2 test-output-title">
                              {val.outputName}
                            </div>
                            <div className="col-10">
                              <input
                                type="text"
                                className="form-control add-order-form-control"
                                id={`exampleInputEmail1_${testIndex}`}
                                aria-describedby="emailHelp"
                                placeholder={val?.result || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    outputIndex,
                                    testIndex,
                                    e.target.value,
                                    value.testName,
                                    value.price,
                                    val.outputName
                                  )
                                }
                                disabled
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedOrder.status === "not_started" ? (
              <button className="btn btn-primary" onClick={handleSubmit}>
                Update Order
              </button>
            ) : selectedOrder.status === "in_progress" ? (
              <div>
                <div class="form-check mb-3 mt-5">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <label class="form-check-label" for="flexCheckDefault">
                    Order is completed and checked{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                </div>
                <button className="btn btn-success" onClick={handleSubmit}>
                  Finish Order
                </button>
              </div>
            ) : (
              <div className="mt-3" style={{ color: "green" }}>
                Order completed and cannot change. &nbsp;
                <button className="btn btn-warning" onClick={sendEmail}>
                  Notify Customer
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default Homepage;
