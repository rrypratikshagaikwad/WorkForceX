import { useState } from "react";
import "./AddEmployee.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    department: "",
    work_location: "",
    employee_type: "",
    shift_hours: "",
    joining_date: ""
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <option value="Office">IT</option>
            <option value="Office">Account</option>
            <option value="Field">Solar</option>
            <option value="Remote">Civil</option>
          </select>
        </div>

        <div className="form-row">
          <input name="work_location" placeholder="Work Location" onChange={handleChange} required />

          <select name="employee_type" onChange={handleChange} required>
            <option value="">Employee Type</option>
            <option value="Office">Office</option>
            <option value="Field">Field</option>
          </select>
        </div>

        <div className="form-row">
          <input name="shift_hours" placeholder="Shift Hours (10AM - 6PM)" onChange={handleChange} required />
          <input type="date" name="joining_date" onChange={handleChange} />
        </div>

        <button type="submit" className="submit-btn">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
