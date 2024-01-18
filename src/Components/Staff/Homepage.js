import React, { useState, useEffect } from "react";
import { IoLogOut } from "react-icons/io5";
import { GrStatusGoodSmall } from "react-icons/gr";

function Homepage() {
  const [selectedOrderType, setSelectedOrderType] = useState("not_started");

  const selectOrderType = (type) => {
    setSelectedOrderType(type);
  };

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
            <a
              className="btn btn-dark order-type-btn"
              onClick={() => selectOrderType("not_started")}
            >
              Not Started
            </a>
            <a
              className="btn btn-dark order-type-btn"
              onClick={() => selectOrderType("in_progress")}
            >
              In Progress
            </a>
            <a
              className="btn btn-dark order-type-btn"
              onClick={() => selectOrderType("completed")}
            >
              Completed
            </a>
          </div>
          <div className="order-table-container">
            {selectedOrderType === "not_started" ? (
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
                    <tr>
                      <th scope="row">1</th>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>Mark</td>
                      <td>Mark</td>
                      <td>
                        <a href="#">Review</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>Mark</td>
                      <td>Mark</td>
                      <td>
                        <a href="#">Review</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>Mark</td>
                      <td>Mark</td>
                      <td>
                        <a href="#">Review</a>
                      </td>
                    </tr>
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
                    <tr>
                      <th scope="row">1</th>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>Mark</td>
                      <td>Mark</td>
                      <td>
                        <a href="#">Continue Working</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>Mark</td>
                      <td>Mark</td>
                      <td>
                        <a href="#">Continue Working</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>Mark</td>
                      <td>Mark</td>
                      <td>
                        <a href="#">Continue Working</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : null}
            {selectedOrderType === "completed" ? (
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
                    <tr>
                      <th scope="row">1</th>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>Mark</td>
                      <td>Mark</td>
                      <td>
                        <a href="#">Start Working</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>Mark</td>
                      <td>Mark</td>
                      <td>
                        <a href="#">Start Working</a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>Mark</td>
                      <td>Mark</td>
                      <td>
                        <a href="#">Start Working</a>
                      </td>
                    </tr>
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
