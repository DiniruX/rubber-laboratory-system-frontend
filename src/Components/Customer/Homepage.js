import React, { useEffect, useState } from "react";
import { IoLogOut } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { GrStatusGoodSmall } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "../Styles.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye } from "react-icons/fa";

function Homepage() {
  const navigate = useNavigate();
  const [addOrderModel, setAddOrderModel] = useState(false);
  const [tests, setTests] = useState([]);
  const [requiredTests, setRequiredTests] = useState([]);
  const [requiredTestPrices, setRequiredTestPrices] = useState([]);
  const [requiredTestOutputs, setRequiredTestOutputs] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [user, setUser] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedOrderModel, setSelectedOrderModel] = useState(false);

  const logout = () => {
    Cookies.remove("user_type");
    Cookies.remove("user_id");
    navigate("/");
    window.location.reload();
  };

  const displayAddOrderModel = () => {
    setAddOrderModel(true);
  };

  const hideAddOrderModel = () => {
    setAddOrderModel(false);
    setSelectedOrderModel(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (requiredTests === "" || totalAmount === "") {
        return toast("Please fill all fields", { type: "error" });
      }
      const data = {
        customerId: user._id,
        customerName: user.customerName,
        companyPhoneNumber: user.companyPhoneNumber,
        contactPersonPhoneNumber: user.contactPersonPhoneNumber,
        companyEmail: user.companyEmail,
        contactPersonEmail: user.contactPersonEmail,
        requiredTests: [],
        totalAmount,
        status: "not_started",
      };

      for (let i = 0; i < requiredTests.length; i++) {
        const testName = requiredTests[i];
        const price = requiredTestPrices[i];
        const outputs = [];
      
        // Iterate through each output for the current test
        for (let j = 0; j < requiredTestOutputs[i].length; j++) {
          const outputName = requiredTestOutputs[i][j];
          const result = 'empty'; 
      
          // Create an object for each output
          const outputObject = {
            outputName,
            result,
          };
      
          // Push the output object to the outputs array
          outputs.push(outputObject);
        }
      
        // Create an object for each test
        const testObject = {
          testName,
          price,
          outputs,
        };
      
        // Push the test object to the requiredTests array in the main data
        data.requiredTests.push(testObject);
      }

      console.log("data: ", data);
      const response = await axios.post("http://localhost:8000/orders/add", data);
      if (response.status === 201) {
        toast.success("Order created successfully", {
          position: "top-right",
          autoClose: 5000,
        });
        setAddOrderModel(false);
        fetchorders();
      }
    } catch (e) {
      console.error("An error occurred during order creation:", e.message);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/tests/get-all")

      .then((res) => {
        const activeTests = res.data.tests.filter(
          (test) => test.status === "active"
        );
        console.log(activeTests)
        setTests(activeTests);
      });
  }, []);

  useEffect(() => {
    const id = Cookies.get("user_id");
    axios
      .get(`http://localhost:8000/user/get-by-id/${id}`)

      .then((res) => {
        setUser(res.data);
      });
  }, []);

  useEffect(() => {
    const id = Cookies.get("user_id");
    try {
      axios
        .get(`http://localhost:8000/orders/get-by-user/${id}`)

        .then((res) => {
          console.log(res.data);
          setOrders(res.data);
        });
    } catch (e) {
      console.error("User session timed out:", e.message);
    }
  }, []);

  const fetchorders = () => {
    const id = Cookies.get("user_id");
    try {
      axios
        .get(`http://localhost:8000/orders/get-by-user/${id}`)

        .then((res) => {
          console.log(res.data);
          setOrders(res.data);
        });
    } catch (e) {
      console.error("No orders to display:", e.message);
    }
  };

  const handleCheckboxChange = (testName, testPrice, outputs) => {
    if (requiredTests.includes(testName)) {
      setRequiredTests((prevTests) =>
        prevTests.filter((test) => test !== testName)
      );
    } else {
      setRequiredTests((prevTests) => [...prevTests, testName]);
    }
    const price = parseFloat(testPrice);
    if (requiredTestPrices.includes(price)) {
      setRequiredTestPrices((prevTests) =>
        prevTests.filter((test) => test !== price)
      );
    } else {
      setRequiredTestPrices((prevTests) => [...prevTests, parseFloat(price)]);
    }
    if (requiredTestOutputs.includes(outputs)) {
      setRequiredTestOutputs((prevTests) =>
        prevTests.filter((test) => test !== outputs)
      );
    } else {
      setRequiredTestOutputs((prevTests) => [...prevTests, outputs]);
    }
  };

  const calculateTotalAmount = () => {
    const totalAmount = requiredTestPrices.reduce(
      (totalAmount, test) => totalAmount + parseFloat(test),
      0
    );
    return totalAmount;
  };

  useEffect(() => {
    const totalAmount = requiredTestPrices.reduce(
      (totalAmount, test) => totalAmount + parseFloat(test),
      0
    );
    setTotalAmount(totalAmount.toString());
  }, [requiredTestPrices]);

  const handleSelectedOrder = (id) => {
    console.log(id);
    try {
      axios
        .get(`http://localhost:8000/orders/get-order/${id}`)

        .then((res) => {
          console.log(res.data);
          setSelectedOrder(res.data);
          setSelectedOrderModel(true);
        });
    } catch (e) {
      console.error("No orders to display:", e.message);
    }
  };

  const eventDate = new Date(selectedOrder.createdAt);
  const dateOptions = { day: "numeric" };
  const monthOptions = { month: "long" };
  const formattedDay = eventDate.toLocaleDateString("en-US", dateOptions);
  const formattedMonth = eventDate.toLocaleDateString("en-US", monthOptions);

  return (
    <div>
      <ToastContainer />
      <div className="homepage-icons">
        <div className="icon-background">
          <IoMdSettings />
        </div>
        <div className="icon-background" onClick={() => logout()}>
          <IoLogOut />
        </div>
      </div>
      <div className="container">
        <h2 className="page-heading">Your Orders</h2>
        <div className="icon-background" onClick={() => displayAddOrderModel()}>
          <FaPlus />
        </div>
        <div className="table-container">
          <table className="table">
            <thead className="thead">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Required Tests</th>
                <th scope="col">Created Date</th>
                <th scope="col">Status</th>
                <th scope="col">See Result</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((val, index) => {
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
                      <th>{index + 1}</th>
                      <td>
                        <ol>
                          {val.requiredTests.map((values, index) => (
                            <li>{values.testName}</li>
                          ))}
                        </ol>
                      </td>
                      <td>
                        {formattedMonth} {formattedDay},
                        {eventDate.getFullYear()}
                      </td>
                      <td>
                        {val.status === "not_started" ? (
                          <div className="status-bad">
                            <GrStatusGoodSmall />
                          </div>
                        ) : val.status === "in_progress" ? (
                          <div className="status-progress">
                            <GrStatusGoodSmall />
                          </div>
                        ) : (
                          <div className="status-good">
                            <GrStatusGoodSmall />
                          </div>
                        )}
                      </td>
                      <td>
                        <div onClick={() => handleSelectedOrder(val._id)}>
                          <div className="icon-background">
                            <FaEye />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <div style={{ fontWeight: "600" }}>No orders to display</div>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {addOrderModel && (
        <div className="add-order-model">
          <form className="form add-order-form">
            <div className="row-container">
              <h4 className="page-subheading">Add Order</h4>
              <IoIosCloseCircleOutline
                className="popup-model-closer"
                onClick={hideAddOrderModel}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Required Tests</label>
              {tests.map((val, index) => (
                <div className="form-check" key={index}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`checkbox-${index}`}
                    onChange={() =>
                      handleCheckboxChange(
                        val.testName,
                        val.testPrice,
                        val.outputs
                      )
                    }
                    checked={requiredTests.includes(val.testName)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`checkbox-${index}`}
                  >
                    {val.testName}
                  </label>
                </div>
              ))}
            </div>
            <div className="mb-3">
              <label className="form-label">Total Amount</label>
              <p style={{ fontWeight: "600" }}>
                Rs. {calculateTotalAmount()}/=
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Complete Order
            </button>
          </form>
        </div>
      )}
      {selectedOrderModel && (
        <div className="add-order-model">
          <form className="form add-order-form">
            <div className="row-container">
              <h4 className="page-subheading">Order Information</h4>
              <IoIosCloseCircleOutline
                className="popup-model-closer"
                onClick={hideAddOrderModel}
              />
            </div>
            <div className="row" style={{ padding: "0px 0px 0px 10px" }}>
              <div className="col-5 order-detail-title">Order ID</div>
              <div className="col-6 order-detail-info">{selectedOrder._id}</div>
              <div className="col-5 order-detail-title">Profile ID</div>
              <div className="col-6 order-detail-info">
                {selectedOrder.customerId}
              </div>
              <div className="col-5 order-detail-title">Name</div>
              <div className="col-6 order-detail-info">
                {selectedOrder.customerName}
              </div>
              <div className="col-5 order-detail-title">
                Company Phone Number ID
              </div>
              <div className="col-6 order-detail-info">
                {selectedOrder.companyPhoneNumber}
              </div>
              <div className="col-5 order-detail-title">Company Email</div>
              <div className="col-6 order-detail-info">
                {selectedOrder.companyEmail}
              </div>
              <div className="col-5 order-detail-title">
                Contact Person Phone Number
              </div>
              <div className="col-6 order-detail-info">
                {selectedOrder.contactPersonPhoneNumber}
              </div>
              <div className="col-5 order-detail-title">
                Contact Person Email
              </div>
              <div className="col-6 order-detail-info">
                {selectedOrder.companyEmail}
              </div>
              <div className="col-5 order-detail-title">Required Tests</div>
              <div className="col-6 order-detail-info">
                <ol>
                  {selectedOrder.requiredTests.map((values, index) => (
                    <li>
                      {values.testName}:
                      {values.outputs.map((values, index) => (
                        <li>
                          {values.outputName}:{values.result}
                        </li>
                      ))}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="col-5 order-detail-title">Total Fee</div>
              <div className="col-6 order-detail-info">
                Rs. {selectedOrder.totalAmount}/=
              </div>
              <div className="col-5 order-detail-title">Order Status</div>
              <div className="col-6 order-detail-info">
                {selectedOrder.status === "not_started" ? (
                  <div>Not Started</div>
                ) : selectedOrder.status === "in_progress" ? (
                  <div>In Progress</div>
                ) : (
                  <div>Completed</div>
                )}
              </div>
              <div className="col-5 order-detail-title">Created Date</div>
              <div className="col-6 order-detail-info">
                {formattedMonth} {formattedDay}, {eventDate.getFullYear()}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Homepage;
