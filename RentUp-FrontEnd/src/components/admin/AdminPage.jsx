import React, { useState, useEffect } from 'react';
import { api } from '../data/Data'; // ✅ will now work
import './AdminPage.css'; // ✅ removed duplicate

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalUsers: 0, totalProperties: 0, activeProperties: 0 });

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'properties') {
      fetchProperties();
    } else if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const usersResponse = await api.get('/users/all');
      const propertiesResponse = await api.get('/properties');
      const totalUsers = usersResponse.data.length;
      const totalProperties = propertiesResponse.data.length;
      const activeProperties = propertiesResponse.data.filter(p => p.status === 'AVAILABLE').length;
      setStats({ totalUsers, totalProperties, activeProperties });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/all');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(user => user.userId !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/users/role/${userId}?role=${newRole}`);
      setUsers(users.map(user =>
        user.userId === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const updatePropertyStatus = async (propertyId, newStatus) => {
    try {
      await api.put(`/properties/${propertyId}/status?status=${newStatus}`);
      setProperties(properties.map(property =>
        property.propertyId === propertyId ? { ...property, status: newStatus } : property
      ));
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  const deleteProperty = async (propertyId) => {
    try {
      await api.delete(`/properties/${propertyId}`);
      setProperties(properties.filter(property => property.propertyId !== propertyId));
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="tabs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={activeTab === 'dashboard' ? 'active' : ''}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={activeTab === 'users' ? 'active' : ''}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={activeTab === 'properties' ? 'active' : ''}
        >
          Properties
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="dashboard-section">
          <h2>Dashboard</h2>
          <div className="stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Properties</h3>
              <p>{stats.totalProperties}</p>
            </div>
            <div className="stat-card">
              <h3>Active Properties</h3>
              <p>{stats.activeProperties}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-section">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.contactNumber}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateUserRole(user.userId, e.target.value)
                      }
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => deleteUser(user.userId)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'properties' && (
        <div className="properties-section">
          <h2>Properties</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Address</th>
                <th>Price</th>
                <th>Status</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(property => (
                <tr key={property.propertyId}>
                  <td>{property.propertyId}</td>
                  <td>{property.address}</td>
                  <td>{property.price}</td>
                  <td>
                    <select
                      value={property.status}
                      onChange={(e) =>
                        updatePropertyStatus(property.propertyId, e.target.value)
                      }
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="SOLD">SOLD</option>
                      <option value="RENTED">RENTED</option>
                    </select>
                  </td>
                  <td>{property.user ? property.user.name : 'N/A'}</td>
                  <td>
                    <button onClick={() => deleteProperty(property.propertyId)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;