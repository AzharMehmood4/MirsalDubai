import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const formFields = [
  { label: "VCC No", name: "vccNo", type: "text" },
  { label: "VCC Generation date", name: "vccDate", type: "date" },
  { label: "Chasis No.", name: "chasisNo", type: "text" },
  { label: "Engine No", name: "engineNo", type: "text" },
  { label: "Vehicle Driver", name: "driver", type: "text" },
  { label: "Year of build", name: "buildYear", type: "text" },
  { label: "Country of origin", name: "origin", type: "text" },
  { label: "Engine capacity", name: "engineCapacity", type: "text" },
  { label: "Carriage capacity", name: "carriageCapacity", type: "text" },
  { label: "Passenger capacity", name: "passengerCapacity", type: "text" },
  { label: "Vehicle Modal", name: "vehicleModal", type: "text" },
  { label: "Vehicle Brand Name", name: "brandName", type: "text" },
  { label: "Vehicle Type", name: "vehicleType", type: "text" },
  { label: "Vehicle Color", name: "color", type: "text" },
  { label: "Specification Standard Name", name: "specification", type: "text" },
  { label: "Declaration Number", name: "declarationNo", type: "text" },
  { label: "Declaration Date", name: "declarationDate", type: "date" },
  { label: "Owner Code", name: "ownerCode", type: "text" },
  { label: "Owner Name", name: "ownerName", type: "text" },
];

const Edit_Record = () => {
  const { vccNo } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [docId, setDocId] = useState(null); // Store the document ID for updates

  // Fetch Firestore record by vccNo
  useEffect(() => {
    const fetchRecord = async () => {
      // Guard against undefined vccNo
      if (!vccNo) {
        console.error("vccNo is undefined in URL params:", vccNo);
        alert("Invalid record ID. Please try again.");
        navigate("/view");
        return;
      }

      try {
        console.log("Fetching record for vccNo:", vccNo); // Debug log
        const q = query(collection(db, "submissions"), where("vccNo", "==", vccNo));
        const querySnapshot = await getDocs(q);
        console.log("Query snapshot size:", querySnapshot.size); // Debug log
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]; // Assume vccNo is unique, take first match
          setFormData(doc.data());
          setDocId(doc.id); // Store the document ID
        } else {
          console.error("No record found for vccNo:", vccNo);
          alert("Record not found.");
          navigate("/view");
        }
      } catch (error) {
        console.error("Error fetching record: ", error);
        alert(`Error fetching record: ${error.message}`);
        navigate("/view");
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [vccNo, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docId) {
      alert("Document ID not found. Please try again.");
      return;
    }
    try {
      const docRef = doc(db, "submissions", docId);
      await updateDoc(docRef, formData);
      alert("Record updated successfully!");
      navigate("/view");
    } catch (error) {
      console.error("Error updating record: ", error);
      alert(`Error updating record: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Page Header */}
      <div className="text-center mb-2">
        <h2 className="fw-bold" style={{color: '#0D009D'}}>EDIT RECORD</h2>
      </div>

      <div className="d-flex justify-content-end mb-4">
        <button className="btn rounded-pill px-4 text-white" style={{backgroundColor: '#0D009D'}} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {formFields.map((field, index) => (
            <div className="col-md-4" key={index}>
              <label htmlFor={field.name} className="form-label">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                className="form-control"
                value={formData[field.name] || ""}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="col-md-12 mt-3">
            <button style={{backgroundColor: '#0D009D'}} type="submit" className="btn text-white mb-4 rounded-pill px-4">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Edit_Record;