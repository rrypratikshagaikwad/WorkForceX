import { useState } from "react";
import "./AddEmployee.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const navigate = useNavigate();
interface ReferenceContact {
  name: string;
  phone: string;
  address: string;
  relation: string;
}
const [formData, setFormData] = useState<{
  full_name: string;
  email: string;
  password: string;
  phone: string;
  designation: string;
  department: string;
  work_location: string;
  employee_type: string;
  shift_hours: string;
  joining_date: string;
  blood_group: string;
  permanent_address: string;
  reference_contacts: ReferenceContact[];
}>({
  full_name: "",
  email: "",
  password: "",
  phone: "",
  designation: "",
  department: "",
  work_location: "",
  employee_type: "",
  shift_hours: "",
  joining_date: "",
  blood_group: "",
  permanent_address: "",
  reference_contacts: [
    { name: "", phone: "", address: "", relation: "" },
    { name: "", phone: "", address: "", relation: "" }
  ]
});

  // 🔹 Normal input handler
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Reference contact handler

const handleReferenceChange = (
  index: number,
  field: keyof ReferenceContact,
  value: string
) => {
  const updatedRefs = [...formData.reference_contacts];
  updatedRefs[index] = {
    ...updatedRefs[index],
    [field]: value
  };

  setFormData({
    ...formData,
    reference_contacts: updatedRefs
  });
};

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/admin/add-employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Employee added successfully");
    setTimeout(() => navigate("/admin/dashboard"), 1200);
  };

  return (
    <div className="add-employee-page">
      <h2>Add New Employee</h2>

      <form onSubmit={handleSubmit} className="employee-form">

        {/* BASIC DETAILS */}
        <div className="form-row">
          <input name="full_name" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        </div>

        <div className="form-row">
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
        </div>

        <div className="form-row">
          <input name="designation" placeholder="Designation" onChange={handleChange} required />
          <select name="department" onChange={handleChange} required>
            <option value="">Department</option>
            <option value="IT">IT</option>
            <option value="Account">Account</option>
            <option value="Solar">Solar</option>
            <option value="Civil">Civil</option>
            <option value="RMC Head">RMC Head</option>
            <option value="Manager">Manager</option>
            <option value="Vehicle">Vehicle</option>
            <option value="RMC">RMC</option>
            <option value="Operation">Operation</option>
            <option value="Collection">Collection</option>
            <option value="Office">Office</option>
            <option value="Design Studio">Design Studio</option>
            <option value="QA/QC">QA/QC</option>
            <option value="Infra">Infra</option>
          </select>
        </div>

        <div className="form-row">
          <input name="work_location" placeholder="Work Location" onChange={handleChange} required />
          <select name="employee_type" onChange={handleChange} required>
            <option value="">Employee Type</option>
            <option value="Head-Office">Head-Office</option>
             <option value="IT-Office">IT-Office</option>
             <option value="Plant-1">Plant 1</option>
             <option value="Plant-2">Plant 2</option>
             <option value="Field">Field</option>
          </select>
        </div>

        <div className="form-row">
          <input name="shift_hours" placeholder="Shift Hours (10AM - 6PM)" onChange={handleChange} required />
          <input type="date" name="joining_date" onChange={handleChange} />
        </div>

        {/* 🩸 BLOOD GROUP */}
        <div className="form-row">
          <select name="blood_group" onChange={handleChange} required>
            <option value="">Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        {/* 🏠 PERMANENT ADDRESS */}
        <div className="form-row">
          <textarea
            name="permanent_address"
            placeholder="Permanent Address"
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        {/* 📞 REFERENCE CONTACTS */}
        <h4>Reference Contact 1</h4>
        <div className="form-row">
          <input placeholder="Name"
            onChange={(e) => handleReferenceChange(0, "name", e.target.value)} />
          <input placeholder="Phone"
            onChange={(e) => handleReferenceChange(0, "phone", e.target.value)} />
        </div>
        <div className="form-row">
          <input placeholder="Relation"
            onChange={(e) => handleReferenceChange(0, "relation", e.target.value)} />
          <input placeholder="Address"
            onChange={(e) => handleReferenceChange(0, "address", e.target.value)} />
        </div>

        <h4>Reference Contact 2</h4>
        <div className="form-row">
          <input placeholder="Name"
            onChange={(e) => handleReferenceChange(1, "name", e.target.value)} />
          <input placeholder="Phone"
            onChange={(e) => handleReferenceChange(1, "phone", e.target.value)} />
        </div>
        <div className="form-row">
          <input placeholder="Relation"
            onChange={(e) => handleReferenceChange(1, "relation", e.target.value)} />
          <input placeholder="Address"
            onChange={(e) => handleReferenceChange(1, "address", e.target.value)} />
        </div>

        <button type="submit" className="submit-btn">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;