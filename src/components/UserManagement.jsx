import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      checkIfUserBlocked();
      fetchUsers();
    }
  }, [token, navigate]);

  const checkIfUserBlocked = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/validate", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      alert("Your account is blocked. Please login again.");
      logout();
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  const handleAction = async (action) => {
    try {
      const response = await axios.get("http://localhost:3000/auth/validate", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 403) {
        alert("Your account is blocked. Please login again.");
        logout();
        return;
      }
      await axios.post(
        `http://localhost:3000/${action}`,
        { userIds: selectedUserIds },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`${action} action completed successfully`);
      fetchUsers();
      setSelectedUserIds([]);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Your account is blocked. Please login again.");
        logout();
      } else {
        console.error(`Error performing ${action}:`, err);
        alert(`Failed to perform ${action}`);
      }
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedUserIds(users.map((user) => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">User Management</h1>
      <button className="btn btn-danger mb-4" onClick={logout}>
        Logout
      </button>

      <div className="mb-4">
        <button
          className="btn btn-warning me-2"
          onClick={() => handleAction("block")}
        >
          Block
        </button>
        <button
          className="btn btn-success me-2"
          onClick={() => handleAction("unblock")}
        >
          Unblock
        </button>
        <button
          className="btn btn-danger"
          onClick={() => handleAction("delete")}
        >
          Delete
        </button>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  selectedUserIds.length === users.length && users.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
            <th>Registered</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{formatDate(user.last_login)}</td>
              <td>{formatDate(user.registration_time)}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
