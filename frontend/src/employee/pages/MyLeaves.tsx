import { useEffect, useState } from "react";
import "./Leave.css";
import { getMyLeaves } from "../../api/leaveApi";
interface Leave {
  leave_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

const MyLeaves = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  // const fetchLeaves = async () => {
  //   const token = localStorage.getItem("token");

  //   const res = await fetch("http://localhost:5000/attendance/my-leaves", {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });

  //   const data = await res.json();
  //   setLeaves(data);
  // };
const fetchLeaves = async () => {
  const { data } = await getMyLeaves();
  setLeaves(data);
};
  return (
    <div className="leave-page">
      <h2>My Leave Requests</h2>

      <table className="leave-table">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(l => (
            <tr key={l.leave_id}>
              <td>{l.start_date}</td>
              <td>{l.end_date}</td>
              <td>{l.reason}</td>
              <td className={`status ${l.status.toLowerCase()}`}>
                {l.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyLeaves;
