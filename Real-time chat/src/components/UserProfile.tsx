import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

// Define profile type
interface Profile {
  profile_image: string;
  bio: string;
  first_name: string;
  last_name: string;
  username: string;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
    profile_image: '',
    bio: '',
    first_name: '',
    last_name: '',
    username: '',
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Profile>(profile);

  // Fetch user profile on component mount
  useEffect(() => {
    axios
      .get('/api/profile/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response: AxiosResponse<Profile>) => {
        setProfile(response.data);
        setFormData(response.data); // Initialize form data with fetched profile data
      })
      .catch((error) => console.error(error));
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .put('http://localhost:8000/api/profile/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response: AxiosResponse<Profile>) => {
        setProfile(response.data);
        setIsEditing(false); // Stop editing mode after successful save
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div>
        <img src={profile.profile_image || '/default-image.jpg'} alt="Profile" />
        {!isEditing ? (
          <div>
            <p>Username: {profile.username}</p>
            <p>First Name: {profile.first_name}</p>
            <p>Last Name: {profile.last_name}</p>
            <p>Bio: {profile.bio}</p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              First Name:
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </label>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </label>
            <label>
              Bio:
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Save</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
