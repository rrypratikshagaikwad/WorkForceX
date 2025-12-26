import { useEffect, useState } from "react";
import "./ViewEmployees.css";
import { toast } from "react-toastify";
import {FaBan } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Employee {
  employee_id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  employee_type: string;
  status: string;
}

const ViewEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // Search & Filter states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
    setPage(1); // reset pagination
  }, 500); // 500ms delay

  return () => clearTimeout(timer);
}, [search]);

useEffect(() => {
  fetchEmployees();
}, [page,debouncedSearch,departmentFilter,statusFilter]);

const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/admin/employees?page=${page}&limit=${limit}&search=${debouncedSearch}&department=${departmentFilter}&status=${statusFilter}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );  

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.message);
      return;
    }

    setEmployees(result.data);
    setTotalPages(result.pagination.totalPages);

  } catch {
    toast.error("Server error");
  } finally {
    setLoading(false);
  }
};

const deactivateEmployee = async (id: number) => {
  if (!window.confirm("Are you sure you want to deactivate this employee?")) {
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/admin/employee/${id}/deactivate`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message);
      return;
    }
    toast.success("Employee deactivated");
    // refresh list
    fetchEmployees();
  } catch (err) {
    toast.error("Server error");
  }
};


  if (loading) return <p className="loading">Loading employees...</p>;

  return (
    <div className="view-employees-page">
      <h2>Employees</h2>
     <div className="filters">
        <input
          type="text"
          placeholder="Search by Name,Email..."
          value={search}
          onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
    }}
        />
        <select
        value={departmentFilter}
        onChange={(e) => {
          setDepartmentFilter(e.target.value);
          setPage(1);
        }}
      >
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Civil">Civil</option>
          <option value="Account">Account</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

      </div>

      <table className="employees-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
        {employees.map((emp) => (
          <tr key={emp.employee_id}>
            <td>{emp.employee_id}</td>
            <td>
              <span
                className="employee-name"
                onClick={() =>
                  navigate(`/admin/employees/${emp.employee_id}/edit`)
                }
              >
          {emp.name}
        </span>
        </td>
        <td>{emp.email}</td>
        <td>{emp.department}</td>
        <td>{emp.designation}</td>
        <td>{emp.employee_type}</td>
        <td>{emp.status}</td>

        <td>
        <FaBan
          className="icon deactivate"
          title="Deactivate Employee"
          onClick={() => deactivateEmployee(emp.employee_id)}
        />
          </td>
        </tr>
      ))}
    </tbody>

      </table>
      <div className="pagination">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
        </div>
      );
    };

export default ViewEmployees;
