import React, { useState, useEffect } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { db, auth } from "../firebase"; // Import auth
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

function View() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [entriesPerPage, setEntriesPerPage] = useState(50); // State for entries per page

  // Fetch data from Firestore in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "submissions"),
      (snapshot) => {
        const fetchedRecords = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecords(fetchedRecords);
      },
      (error) => {
        console.error("Error fetching records: ", error);
        alert(`Error fetching records: ${error.message}`);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAddNew = () => {
    navigate("/Add-record");
  };

  const Editrecord = (vccNo) => {
    navigate(`/Edit-record/${vccNo}`); // Use vccNo for editing
  };

  // const Viewrecord = (vccNo) => {
  //   navigate(`/View-file/${vccNo}`); // Use vccNo for viewing
  // };

  const Viewrecord = (vccNo) => {
    const secretKey = "674157aa2c264ed1a65c801f0669e536"; // static key
    navigate(
      `/m2decext/vcc/invokeViewDigitalVCCDetails.do?value(vccNo)=${vccNo}&value(secretKey)=${secretKey}`
    );
  };

  const DeleteRecord = async (vccNo) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        // Check if user is authenticated
        if (!auth.currentUser) {
          console.log("No authenticated user found");
          alert("Please log in to delete records.");
          return;
        }
        console.log("Attempting to delete record with vccNo:", vccNo); // Debug log
        const q = query(
          collection(db, "submissions"),
          where("vccNo", "==", vccNo)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]; // Assume vccNo is unique, take first match
          await deleteDoc(doc.ref);
          console.log(`Record with vccNo ${vccNo} deleted successfully`);
        } else {
          console.error("No record found for vccNo:", vccNo);
          alert("No record found to delete.");
        }
      } catch (error) {
        console.error("Error deleting record: ", error);
        alert(`Error deleting record: ${error.message}`);
      }
    }
  };

  // Filter records based on search term
  const filteredRecords = records.filter((record) => {
    const vccNoMatch = record.vccNo
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const chasisNoMatch = record.chasisNo
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return vccNoMatch || chasisNoMatch;
  });

  // Slice records based on entries per page
  const displayedRecords = filteredRecords.slice(0, entriesPerPage);

  // Handle dropdown selection
  const handleEntriesSelect = (eventKey) => {
    setEntriesPerPage(parseInt(eventKey, 10));
  };

  return (
    <div className="container-fluid p-5">
      <div className="row mb-3">
        <div className="col-sm-12 text-center">
          <h2 className="pt-2" style={{ color: "#0D009D" }}>
            VCC LIST SITE
          </h2>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-2 offset-10">
          <button
            className="btn text-white"
            onClick={handleAddNew}
            style={{ backgroundColor: "#0D009D", borderColor: "#0D009D" }}
          >
            + Add new
          </button>
        </div>
      </div>
      <div className="container">
        <div className="row mt-3 mb-3">
          <div className="col-sm-3">
            <div className="d-flex align-items-center">
              <span className="me-2">Show</span>
              <DropdownButton
                id="dropdown-basic-button"
                title={entriesPerPage}
                variant="outline-secondary"
                className="me-2"
                onSelect={handleEntriesSelect}
              >
                <Dropdown.Item eventKey="10">10</Dropdown.Item>
                <Dropdown.Item eventKey="25">25</Dropdown.Item>
                <Dropdown.Item eventKey="50">50</Dropdown.Item>
                <Dropdown.Item eventKey="100">100</Dropdown.Item>
              </DropdownButton>
              <span>entries</span>
            </div>
          </div>
          <div className="col-sm-3 offset-6">
            <input
              type="text"
              className="form-control"
              placeholder="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            ></input>
          </div>
        </div>
        <div className="row mh-25">
          <div
            className="col-sm-12 overflow-scroll "
            style={{ maxHeight: "75vh" }}
          >
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">VCC No</th>
                  <th scope="col">Genration date</th>
                  <th scope="col">Chasis no</th>
                  <th scope="col">Engine no</th>
                  <th scope="col">Brand Name</th>
                  <th scope="col">Owner code</th>
                  <th scope="col">Date Added</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedRecords.map((record, index) => (
                  <tr key={record.id}>
                    <td scope="row">{record.vccNo}</td>
                    <td>
                      {record.vccDate
                        ? new Date(record.vccDate).toLocaleDateString()
                        : ""}
                    </td>
                    <td>{record.chasisNo}</td>
                    <td>{record.engineNo}</td>
                    <td>{record.brandName}</td>
                    <td>{record.ownerCode}</td>
                    <td>
                      {record.timestamp
                        ? record.timestamp.toDate().toLocaleDateString()
                        : ""}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => Viewrecord(record.vccNo)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => Editrecord(record.vccNo)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => DeleteRecord(record.vccNo)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default View;