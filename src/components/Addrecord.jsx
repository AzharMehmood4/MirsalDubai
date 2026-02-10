import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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
  { label: "Print Remark", name: "printRemark", type: "text" },
  { label: "Vcc Status", name: "vccStatus", type: "text" },
];

const AddRecord = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vccNo: "",
    vccDate: "",
    chasisNo: "",
    engineNo: "",
    driver: "",
    buildYear: "",
    origin: "",
    engineCapacity: "",
    carriageCapacity: "",
    passengerCapacity: "",
    vehicleModal: "",
    brandName: "",
    vehicleType: "",
    color: "",
    specification: "",
    declarationNo: "",
    declarationDate: "",
    ownerCode: "",
    ownerName: "",
    vccStatus: "",
    printRemark: "",
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to submit the form.");
      return;
    }
    try {
      await addDoc(collection(db, "submissions"), {
        ...formData,
        userId: user.uid, // Store user ID for tracking
        timestamp: new Date(), // Add timestamp for sorting
      });
      alert("Record saved successfully!");
      setFormData({
        vccNo: "",
        vccDate: "",
        chasisNo: "",
        engineNo: "",
        driver: "",
        buildYear: "",
        origin: "",
        engineCapacity: "",
        carriageCapacity: "",
        passengerCapacity: "",
        vehicleModal: "",
        brandName: "",
        vehicleType: "",
        color: "",
        specification: "",
        declarationNo: "",
        declarationDate: "",
        ownerCode: "",
        ownerName: "",
        vccStatus: "",
        printRemark: "",
      });
      navigate(-1);
    } catch (error) {
      console.error("Error saving record: ", error);
      alert(`Error saving record: ${error.message}`);
    }
  };

  return (
    <div className="container mt-5">
      {/* Page Header */}
      <div className="text-center mb-2">
        <h2 className="fw-bold" style={{ color: '#0D009D' }} >ADD NEW RECORD</h2>
      </div>

      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn text-white rounded-pill px-4"
          style={{backgroundColor: '#0D009D' }}
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {formFields.map((field, index) => (
            <div className="col-md-4" key={index}>
              <label>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                className="form-control"
                value={formData[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="col-md-12 mt-3">
            <button type="submit" className="btn mb-4  text-white rounded-pill px-4" style={{backgroundColor: '#0D009D' }}>
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRecord;