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
      
      console.log("RAW API RESPONSE:", response.data);

      const responseData = response.data;
      
      // Extract array safely from multiple possible formats (Direct array, nested under applications, data, or result)
      const appList = Array.isArray(responseData) 
        ? responseData 
        : (responseData.applications || responseData.data || responseData.result || []);

      console.log("PARSED APPLICATION LIST:", appList);

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

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to change status to ${status}?`)) return;

    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);

    try {
      const response = await axios.post("https://abedhiggs.alwaysdata.net/sseapis/updateapplicationstatus.php", formData);
      alert(response.data.message || "Status updated successfully!");
      loadApplications();
    } catch (err) {
      alert("Unable to update application status.");
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
      loadApplications();
      
      // Refresh modal view data
      const updatedRes = await axios.get("https://abedhiggs.alwaysdata.net/sseapis/getapplications.php");
      const updatedData = updatedRes.data;
      const appList = Array.isArray(updatedData) 
        ? updatedData 
        : (updatedData.applications || updatedData.data || updatedData.result || []);
      
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
                  <th>Status</th>
                  <th>Fee Status</th>
                  <th>Balance Left</th>
                  <th style={{ minWidth: "280px" }}>Actions</th>
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
                        <span className={`badge ${app.status === 'Accepted' ? 'bg-success' : app.status === 'Rejected' ? 'bg-danger' : app.status === 'Completed' ? 'bg-info text-dark' : 'bg-warning text-dark'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${app.fee_status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
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
                                disabled={Number(app.remaining_vacancies) <= 0}
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

                          {app.status === "Accepted" && (
                            <select
                              className="form-select form-select-sm border-secondary text-secondary fw-semibold"
                              style={{ width: "135px" }}
                              onChange={(e) => {
                                if (e.target.value) {
                                  updateStatus(app.id, e.target.value);
                                  e.target.value = "";
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>Update Status</option>
                              <option value="Completed">Completed</option>
                              <option value="Dropped">Dropped</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">No applications found.</td>
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
                  <div className="col-md-6">
                    <label className="fw-bold text-muted small">Course</label>
                    <div className="p-2 bg-white rounded border">{selectedApp.course}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="fw-bold text-muted small">Application Status</label>
                    <div className="p-2 bg-white rounded border fw-bold">{selectedApp.status}</div>
                  </div>

                  {/* Manual Fee Input Section */}
                  <div className="col-12 mt-3">
                    <div className="p-3 border rounded bg-white shadow-sm">
                      <h6 className="fw-bold text-success mb-3"><i className="bi bi-wallet2 me-2"></i> Manual Fee Ledger (KSH)</h6>
                      
                      <div className="row g-2 align-items-end">
                        <div className="col-md-4">
                          <label className="small text-muted">Type Total Course Fee</label>
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
                            {selectedApp.fee_status || 'Pending'}
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