// Profile.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../common/UserProvider";
import axios from "axios";
import "./Profile.css"; 
import { serverUrl, api } from "../data/Data";

const Profile = () => {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    userEmail: user.email,
    userName: user.name,
    userProfilePicture: user.userProfilePicture,
  });
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const [userProfilePictureRender, setUserProfilePicture] = useState(null);
 


  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user !== null) {
        try {
          const response1 = await api.get(`/users/profile/${user.contactNumber}`, {
            responseType: 'arraybuffer',
          });
  
          const base64Image = btoa(
            new Uint8Array(response1.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );
              
          setUserProfilePicture(`data:${response1.headers['content-type']};base64,${base64Image}`);
          } catch (error) {
          console.log(error);
        }
      }
    };
    fetchProfilePicture();
  }, [user]);   
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordData.oldPassword) {
      errors.oldPassword = "Old password is required";
    }
    if (passwordData.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (validatePasswordForm()) {
      try {
        const response = await api.post('/users/change-password', {
          contactNumber: user.contactNumber,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        });
        alert(response.data || "Password changed successfully");
        setChangePasswordMode(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } catch (error) {
        alert("Failed to change password: " + (error.response?.data || "Unknown error"));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/users/${user.userId}?userName=${formData.userName}&userEmail=${formData.userEmail}`);
      setUser(response.data);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (error) {
      alert("Failed to update profile: " + (error.response?.data || "Unknown error"));
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              disabled
            />
          </div>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
            />
          </div>
          <div className="button-group">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : changePasswordMode ? (
        <form onSubmit={handlePasswordSubmit} className="profile-form">
          <h3>Change Password</h3>
          <div className="form-group">
            <label htmlFor="oldPassword">Old Password:</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              required
            />
            {passwordErrors.oldPassword && <div className="error-message">{passwordErrors.oldPassword}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            {passwordErrors.newPassword && <div className="error-message">{passwordErrors.newPassword}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            {passwordErrors.confirmPassword && <div className="error-message">{passwordErrors.confirmPassword}</div>}
          </div>
          <div className="button-group">
            <button type="submit" className="save-btn">Change Password</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setChangePasswordMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-pic-container">
        <div className="profile-info">
          <p>Email: {user.email}</p>
          <p>Name: {user.name}</p>
          {/* <p>Is Admin:{user.isAdmin}</p> */}
          <p>Contact Number: {user.contactNumber}</p>
          {user.subscriptionType != null ?
            <div>
              <p>Subscription Plan: {user.subscriptionType}</p>
              <p>Subscription End Date: {user.subscriptionEndDate}</p>
            </div>
            : ""}
          <p>Properties Left: {user.propertiesLeft>2000000? 'Unlimited' : user.propertiesLeft}</p>
          <button onClick={() => setEditMode(true)} className="edit-btn">
            Edit
          </button>
          <button onClick={() => setChangePasswordMode(true)} className="edit-btn" style={{ marginLeft: '10px' }}>
            Change Password
          </button>
        </div>
        <div>
        <p>
            {userProfilePictureRender && (
              <img src={userProfilePictureRender} alt="ProfilePicture" />
            )}
          </p>
        </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
