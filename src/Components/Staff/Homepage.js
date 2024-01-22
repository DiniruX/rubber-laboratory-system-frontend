import React, { useState, useEffect } from "react";
import { IoLogOut } from "react-icons/io5";
import axios from "axios";

function Homepage() {
  const [selectedOrderType, setSelectedOrderType] = useState("not_started");
  const [inProgOrders, setInProgOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [notStartedOrders, setNotStartedOrders] = useState([]);

  const selectOrderType = (type) => {
    setSelectedOrderType(type);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/orders/get-all")

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
  }, []);

  return (
    <div>
      <div className="homepage-icons">
        <div className="icon-background">
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
                          <th scope="row">{index+1}</th>
                          <td>
                            {val.requiredTests.map((test, index) => (
                              <li>{test}</li>
                            ))}
                          </td>
                          <td>
                            {formattedMonth} {formattedDay},{" "}
                            {eventDate.getFullYear()}
                          </td>
                          <td>{val.customerName}</td>
                          <td>{val.contactPersonPhoneNumber}</td>
                          <td>
                            <div>Review</div>
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
                        <th scope="row">{index+1}</th>
                        <td>
                          {val.requiredTests.map((test, index) => (
                            <li>{test}</li>
                          ))}
                        </td>
                        <td>
                          {formattedMonth} {formattedDay},{" "}
                          {eventDate.getFullYear()}
                        </td>
                        <td>{val.customerName}</td>
                        <td>{val.contactPersonPhoneNumber}</td>
                        <td>
                          <div>Review</div>
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
                        <th scope="row">{index+1}</th>
                        <td>
                          {val.requiredTests.map((test, index) => (
                            <li>{test}</li>
                          ))}
                        </td>
                        <td>
                          {formattedMonth} {formattedDay},{" "}
                          {eventDate.getFullYear()}
                        </td>
                        <td>{val.customerName}</td>
                        <td>{val.contactPersonPhoneNumber}</td>
                        <td>
                          <div>Review</div>
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
    </div>
  );
}

export default Homepage;
