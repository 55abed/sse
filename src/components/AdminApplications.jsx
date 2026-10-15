import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Fee input states
  const [paymentInput, setPaymentInput] = useState("");
  const [totalFeeInput, setTotalFeeInput] = useState("");

  const loadApplications = async () => {
    setLoading("Loading applications...");
    setError("");

    try {
      const response = await axios.get("https://abedhiggs.alwaysdata.net/sseapis/getapplications.php");
      const responseData = response.data;
      
      const appList = Array.isArray(responseData) 
        ? responseData 
        : (responseData.applications || responseData.data || responseData.result || []);

      if (appList.length > 0) {
        setApplications(appList);
      } else {
        setApplications([]);
        setError(responseData.message || "No applications found.");
      }
      setLoading("");
    } catch (err) {
      console.error("AXIOS ERROR:", err);
      setLoading("");
      setError("Unable to load applications.");
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Update Application or Student Status
  const updateStatus = async (id, status) => {
    let initialTotalFee = 0;

    if (status === "Accepted") {
      const input = window.prompt("Enter Total Course Fee (KSH) for this student:", "15000");
      if (input === null) return;
      initialTotalFee = parseFloat(input) || 0;
    } else if (status !== "In School" && status !== "Completed" && status !== "Dropped Out") {
      if (!window.confirm(`Are you sure you want to set application status to ${status}?`)) return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    if (status === "Accepted") {
      formData.append("totalFee", initialTotalFee);
    }

    try {
      const response = await axios.post("https://abedhiggs.alwaysdata.net/sseapis/updateapplicationstatus.php", formData);
      alert(response.data.message || "Status updated successfully!");
      loadApplications();
    } catch (err) {
      alert("Unable to update status.");
    }
  };

  const handleFeeAction = async (id) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("actionType", "update_fee");
    formData.append("totalFee", parseFloat(totalFeeInput || 0));
    formData.append("paymentAmount", parseFloat(paymentInput || 0));

    try {
      const response = await axios.post("https://abedhiggs.alwaysdata.net/sseapis/updateapplicationstatus.php", formData);
      alert(response.data.message);
      setPaymentInput("");
      
      const updatedRes = await axios.get("https://abedhiggs.alwaysdata.net/sseapis/getapplications.php");
      const updatedData = updatedRes.data;
      const appList = Array.isArray(updatedData) 
        ? updatedData 
        : (updatedData.applications || updatedData.data || updatedData.result || []);
      
      setApplications(appList);

      const refreshed = appList.find(app => String(app.id) === String(id));
      if (refreshed) {
        setSelectedApp(refreshed);
        setTotalFeeInput(refreshed.total_fee || "");
      }
    } catch (err) {
      alert("Failed to update fee details.");
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 my-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-success text-white py-3">
          <h2 className="mb-0 fs-4 fw-bold">Student Applications & Fee Management</h2>
        </div>

        <div className="card-body p-3">
          {loading && <div className="alert alert-info">{loading}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-nowrap mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>App Status</th>
                  <th>Student Status</th>
                  <th>Fee Status</th>
                  <th>Balance Left</th>
                  <th style={{ minWidth: "200px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id}>
                      <td className="fw-bold">{app.id}</td>
                      <td>{app.fullname}</td>
                      <td>{app.course}</td>
                      <td>
                        <span className={`badge ${
                          app.status === 'Accepted' ? 'bg-success' : 
                          app.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'
                        }`}>
                          {app.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        {/* Student Status Dropdown */}
                        {app.status === "Accepted" ? (
                          <select
                            className={`form-select form-select-sm fw-bold ${
                              (app.student_status || "In School") === "Completed" ? "border-success text-success" :
                              (app.student_status || "In School") === "Dropped Out" ? "border-danger text-danger" :
                              "border-primary text-primary"
                            }`}
                            value={app.student_status || "In School"}
                            onChange={(e) => updateStatus(app.id, e.target.value)}
                          >
                            <option value="In School">In School</option>
                            <option value="Completed">Completed</option>
                            <option value="Dropped Out">Dropped Out</option>
                          </select>
                        ) : (
                          <span className="text-muted small">N/A</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          app.fee_status === 'Cleared' ? 'bg-success' : 
                          app.fee_status === 'Arrears' ? 'bg-danger' : 'bg-warning text-dark'
                        }`}>
                          {app.fee_status || 'Pending'}
                        </span>
                      </td>
                      <td className="fw-bold text-danger">
                        KSH {Number(app.fee_balance || 0).toLocaleString()}
                      </td>
                      <td>
                        <div className="d-flex gap-2 align-items-center">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => { 
                              setSelectedApp(app); 
                              setTotalFeeInput(app.total_fee || ""); 
                              setPaymentInput("");
                            }}
                            data-bs-toggle="modal"
                            data-bs-target="#viewApplicationModal"
                          >
                            <i className="bi bi-eye-fill me-1"></i> View & Fees
                          </button>

                          {app.status === "Pending" && (
                            <>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => updateStatus(app.id, "Accepted")}
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => updateStatus(app.id, "Rejected")}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">No applications found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VIEW & FEE MANAGEMENT MODAL */}
      <div className="modal fade" id="viewApplicationModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title">
                Student Profile & Fee Ledger — {selectedApp?.fullname}
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body p-4 bg-light">
              {selectedApp ? (
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="fw-bold text-muted small">Course</label>
                    <div className="p-2 bg-white rounded border">{selectedApp.course}</div>
                  </div>
                  <div className="col-md-4">
                    <label className="fw-bold text-muted small">Application Status</label>
                    <div className="p-2 bg-white rounded border fw-bold">{selectedApp.status}</div>
                  </div>
                  <div className="col-md-4">
                    <label className="fw-bold text-muted small">Student Status</label>
                    <div className="p-2 bg-white rounded border fw-bold text-primary">
                      {selectedApp.student_status || "In School"}
                    </div>
                  </div>

                  <div className="col-12 mt-3">
                    <div className="p-3 border rounded bg-white shadow-sm">
                      <h6 className="fw-bold text-success mb-3">
                        <i className="bi bi-wallet2 me-2"></i> Fee Ledger (KSH)
                      </h6>
                      
                      <div className="row g-2 align-items-end">
                        <div className="col-md-4">
                          <label className="small text-muted">Total Course Fee</label>
                          <input 
                            type="number" 
                            className="form-control form-control-sm" 
                            placeholder="e.g. 15000"
                            value={totalFeeInput}
                            onChange={(e) => setTotalFeeInput(e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="small text-muted">Remaining Balance</label>
                          <div className="p-1 bg-light border rounded fw-bold text-danger">
                            KSH {Number(selectedApp.fee_balance || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="small text-muted">Fee Status</label>
                          <div className="p-1 bg-light border rounded fw-bold">
                            <span className={`badge ${
                              selectedApp.fee_status === 'Cleared' ? 'bg-success' : 
                              selectedApp.fee_status === 'Arrears' ? 'bg-danger' : 'bg-warning text-dark'
                            }`}>
                              {selectedApp.fee_status || 'Pending'}
                            </span>
                          </div>
                        </div>

                        <div className="col-md-8 mt-2">
                          <label className="small text-muted">Enter Payment to Deduct</label>
                          <input 
                            type="number" 
                            className="form-control form-control-sm" 
                            placeholder="e.g. 5000"
                            value={paymentInput}
                            onChange={(e) => setPaymentInput(e.target.value)}
                          />
                        </div>
                        <div className="col-md-4 mt-2">
                          <button 
                            className="btn btn-success btn-sm w-100"
                            onClick={() => handleFeeAction(selectedApp.id)}
                          >
                            Save / Deduct Fee
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted">No details available.</p>
              )}
            </div>

            <div className="modal-footer bg-white">
              <button type="button" className="btn btn-secondary btn-sm rounded-pill px-4" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApplications;