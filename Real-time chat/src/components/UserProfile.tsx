import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit } from 'react-icons/fa'; // Import edit icon from react-icons

// Define Profile type
interface Profile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  profile_image: string | null;
}

interface UserProfileResponse {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: Profile;
}

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Full height of the viewport */
  background-color: #121212; /* Black background */
  padding: 20px;
  box-sizing: border-box;
`;

const ProfileCard = styled.div`
  background: #1f1f1f; /* Dark card background */
  color: #fff; /* White text for dark mode */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: row;
  padding: 20px;
  max-width: 600px;
  width: 100%;
`;

const ProfileImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
  }

  .placeholder {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #666;
  }
`;

const ProfileDetails = styled.div`
  flex: 2;
  padding: 0 20px;

  h2 {
    margin: 0;
    font-size: 24px;
    color: #fff;
  }

  p {
    margin: 10px 0;
    font-size: 16px;
    color: #ccc;
  }
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #4a90e2; /* Button color */
  color: white;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background: #3a78d1;
    box-shadow: 0 4px 8px rgba(74, 144, 226, 0.6);
  }

  svg {
    margin-right: 8px; /* Space between icon and text */
  }
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: #ff4d4f;
  font-size: 18px;
  padding: 20px;
`;

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem('userData');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else {
      setProfile(null);
    }
  }, []);

  if (!profile) {
    return <ErrorMessage>No profile data available. Please log in.</ErrorMessage>;
  }

  return (
    <Container>
      <ProfileCard>
        <ProfileImage>
          {profile.profile.profile_image ? (
            <img src={'http://localhost:8000' + profile.profile.profile_image} alt="Profile" />
          ) : (
            <div className="placeholder">No Image</div>
          )}
        </ProfileImage>
        <ProfileDetails>
          <h2>
            {profile.first_name} {profile.last_name}
          </h2>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Bio:</strong> {profile.profile.bio || 'No bio available'}
          </p>
          <EditButton>
            <FaEdit /> Edit Profile
          </EditButton>
        </ProfileDetails>
      </ProfileCard>
    </Container>
  );
};

export default UserProfile;
