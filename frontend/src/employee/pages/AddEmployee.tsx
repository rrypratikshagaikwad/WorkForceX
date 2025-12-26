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
    employee_type: "",
    shift_hours: ""
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
    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 1200);
    setFormData({
      full_name: "",
      email: "",
      password: "",
      employee_type: "",
      shift_hours: ""
    });
    
  };

  return (
    <div className="add-employee-page">
      <h2>Add Employee</h2>

      <form onSubmit={handleSubmit} className="employee-form">
        <input
          type="text"
          name="full_name"
          placeholder="Employee Name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="employee_type"
          placeholder="Employee Type (Office / Field)"
          value={formData.employee_type}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="shift_hours"
          placeholder="Shift Hours (9AM - 6PM)"
          value={formData.shift_hours}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
