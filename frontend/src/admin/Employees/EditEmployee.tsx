import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./EditEmployee.css";

interface Employee {
  full_name: string;
  designation: string;
  department: string;
  phone: string;
  work_location: string;
  employee_type: string;
  status: string;
}

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<Employee>({
    full_name: "",
    designation: "",
    department: "",
    phone: "",
    work_location: "",
    employee_type: "",
    status: "active"
  });

  /* ================= FETCH EMPLOYEE ================= */
  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/admin/employees/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load employee");
        return;
      }

      setEmployee(data);
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  /* ================= UPDATE EMPLOYEE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/admin/employees/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(employee)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Update failed");
        return;
      }

      toast.success("Employee updated successfully");

      setTimeout(() => {
        navigate("/admin/employees");
      }, 1200);

    } catch {
      toast.error("Server error");
    }
  };

  if (loading) return <p className="loading">Loading employee...</p>;

  return (
    <div className="edit-employee-page">
      <h2>Edit Employee</h2>

      <form onSubmit={handleSubmit} className="edit-form">

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={employee.full_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={employee.designation || ""}
          onChange={handleChange}
        />

        <select
          name="department"
          value={employee.department}
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
          <option value="Account">Account</option>
          <option value="Production">Production</option>
        </select>

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={employee.phone || ""}
          onChange={handleChange}
        />

        <input
          type="text"
          name="work_location"
          placeholder="Work Location"
          value={employee.work_location || ""}
          onChange={handleChange}
        />

        <select
          name="employee_type"
          value={employee.employee_type}
          onChange={handleChange}
        >
          <option value="office">Office</option>
          <option value="field">Field</option>
          <option value="intern">Intern</option>
        </select>

        <select
          name="status"
          value={employee.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="form-actions">
          <button
            type="button"
            className="cancel"
            onClick={() => navigate("/admin/employees")}
          >
            Cancel
          </button>

          <button type="submit" className="save">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;
