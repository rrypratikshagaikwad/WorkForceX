import { useEffect, useState } from "react";
import "./ManageLeaves.css";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { getAllLeaves, updateLeaveStatus } from "../../api/adminApi";
interface Leave {
  leave_id: number;
  full_name: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  // const fetchLeaves = async () => {
  //   const token = localStorage.getItem("token");

  //   const res = await fetch("http://localhost:5000/admin/all", {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });

  //   const data = await res.json();
  //   setLeaves(data);
  // };

  // const updateStatus = async (id: number, status: string) => {
  //   const token = localStorage.getItem("token");

  //   const res = await fetch(`http://localhost:5000/admin/${id}/status`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({ status }),
  //   });

  //   const data = await res.json();

  //   if (!res.ok) {
  //     toast.error(data.message);
  //     return;
  //   }

  //   toast.success("Status updated");
  //   fetchLeaves();
  // };
const fetchLeaves = async () => {
    try {
      const data = await getAllLeaves();
      setLeaves(data);
    } catch (error: any) {
      toast.error("Failed to load leaves");
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateLeaveStatus(id, status);
      toast.success("Status updated");
      fetchLeaves();
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="leave-page">
      <h2>Leave Requests</h2>

      <table className="leave-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map(l => (
            <tr key={l.leave_id}>
              <td>{l.full_name}</td>
              <td>{l.start_date}</td>
              <td>{l.end_date}</td>
              <td>{l.reason}</td>
              <td>{l.status}</td>
              <td>
              {l.status === "PENDING" && (
                <>
                  <FaCheckCircle
                    className="icon approve"
                    title="Approve"
                    onClick={() => handleStatusUpdate(l.leave_id, "APPROVED")}
                  />
                  <FaTimesCircle
                    className="icon reject"
                    title="Reject"
                    onClick={() => handleStatusUpdate(l.leave_id, "REJECTED")}
                  />
                </>
              )}
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageLeaves;
