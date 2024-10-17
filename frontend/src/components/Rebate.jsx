import React, { useState } from "react";
import axios from "axios"; // Import axios for HTTP requests
import "./Rebate.css";

function Rebate() {
  // Define state variables for form inputs
  const [reasonInput, setReasonInput] = useState("");
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/rebate/post`,
        {
          user: userId, // Match the backend field name
          reason: reasonInput, // Match the backend field name
          dateFrom: startDateInput, // Match the backend field name
          dateTo: endDateInput, // Match the backend field name
        }
      );
      console.log(response.data);
      alert("rebate submitted successfully");
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Error request data:", err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", err.message);
      }
    }
  };

  return (
    <div className="container-rebate">
      <div className="first-container-rebate">
        <h1 className="first-container-text-1-rebate">
          Thinking of skipping the mess...
        </h1>
        <h1 className="first-container-text-2-rebate">Fill Rebate Form</h1>
      </div>
      <form className="form-container-rebate" onSubmit={handleSubmit}>
        <div className="form-container-div-1-rebate">
          <label className="form-label-1-rebate">
            Enter reason for not attending mess :{" "}
          </label>
          <input
            type="text"
            className="form-input-1-rebate"
            placeholder="Enter reason..."
            value={reasonInput}
            onChange={(e) => setReasonInput(e.target.value)} // Update state on input change
          />
        </div>
        <div className="form-container-div-2-rebate">
          <label className="form-label-2-rebate">Start Date : </label>
          <input
            className="form-input-2-rebate"
            type="date"
            value={startDateInput}
            onChange={(e) => setStartDateInput(e.target.value)} // Update state on input change
          />
        </div>
        <div className="form-container-div-3-rebate">
          <label className="form-label-3-rebate">End Date : </label>
          <input
            className="form-input-3-rebate"
            type="date"
            value={endDateInput}
            onChange={(e) => setEndDateInput(e.target.value)} // Update state on input change
          />
        </div>
        <button className="btn-rebate" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Rebate;
