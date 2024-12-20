import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
interface Profile {
  bio: string;
  profile_image: string;
}

// Define the Contact interface
interface Contact {
  id: number;
  username: string;
  bio: string;
  badge: number | null;
  profile: Profile;
}


// Define the Message interface
interface Message {
  sender: 'parker' | 'stark'; // You can define more sender types if needed
  text: string;
  time: string;
}

// Styled components (No change here)
const Container = styled.div`
  position: absolute;
  top: 50%;
  left: calc(50% + 12rem);
  transform: translate(-50%, -50%);
  display: flex;
  gap: 2rem;
`;

// Contact list styled components
const Contacts = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-6rem, -50%);
  width: 24rem;
  height: 32rem;
  padding: 1rem 2rem 1rem 1rem;
  box-sizing: border-box;
  border-radius: 1rem 0 0 1rem;
  background: white;
  box-shadow: 0 0 8rem 0 rgba(0, 0, 0, 0.1), 2rem 2rem 4rem -3rem rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: transform 500ms;

  h2 {
    margin: 0.5rem 0 1.5rem 5rem;
  }

  &:hover {
    transform: translate(-23rem, -50%);
  }
`;

const Contact = styled.div`
  position: relative;
  margin-bottom: 1rem;
  padding-left: 5rem;
  height: 4.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .pic {
    position: absolute;
    left: 0;
    width: 4rem;
    height: 4rem;
    background-size: cover;
    background-position: center;
    border-radius: 50%;
  }

  .name {
    font-weight: 500;
    margin-bottom: 0.125rem;
  }

  .message,
  .seen {
    font-size: 0.9rem;
    color: #999;
  }

  .badge {
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    text-align: center;
    font-size: 0.9rem;
    padding-top: 0.125rem;
    border-radius: 1rem;
    top: 0;
    left: 2.5rem;
    background: #333;
    color: white;
  }
`;

// Chat window styled components
const Chat = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24rem;
  height: 38rem;
  z-index: 2;
  box-sizing: border-box;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 0 8rem 0 rgba(0, 0, 0, 0.1), 0 2rem 4rem -3rem rgba(0, 0, 0, 0.5);

  .contact.bar {
    margin: 1rem;
    box-sizing: border-box;
  }

  .messages {
    padding: 1rem;
    background: #f7f7f7;
    flex-shrink: 2;
    overflow-y: auto;
    box-shadow: inset 0 2rem 2rem -2rem rgba(0, 0, 0, 0.05), inset 0 -2rem 2rem -2rem rgba(0, 0, 0, 0.05);

    .time {
      font-size: 0.8rem;
      background: #eee;
      padding: 0.25rem 1rem;
      border-radius: 2rem;
      color: #999;
      width: fit-content;
      margin: 0 auto;
    }

    .message {
      padding: 0.5rem 1rem;
      margin: 1rem;
      background: #fff;
      border-radius: 1.125rem 1.125rem 1.125rem 0;
      min-height: 2.25rem;
      width: fit-content;
      max-width: 50%;
      box-shadow: 0 0 2rem rgba(0, 0, 0, 0.075), 0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.1);

      &.parker {
        margin: 1rem 1rem 1rem auto;
        background: #333;
        color: white;
      }
    }
  }

  .input {
    display: flex;
    align-items: center;
    padding: 0 0.5rem 0 1.5rem;

    i {
      font-size: 1.5rem;
      margin-right: 1rem;
      color: #999;
      cursor: pointer;
    }

    input {
      border: none;
      padding: 0.5rem 1rem;
      margin-right: 1rem;
      border-radius: 1.125rem;
      flex-grow: 2;
      background: white;
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: #f1f1f1;
  border-radius: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 100%;
  max-width: 500px; // Optional: Limit the width for better layout
`;

const InputField = styled.input`
  flex-grow: 1;
  border: none;
  padding: 0.8rem 1.5rem;
  margin-right: 0.8rem;
  border-radius: 1rem;
  background-color: #ffffff;
  color: #333;
  font-size: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &::placeholder {
    color: #aaa;
  }
`;
// ChatApp Component with TypeScript interfaces
const ChatApp: React.FC = () => {
  // State variables with types
  const [contacts, setContacts] = useState<Contact[]>([]); // contacts state type
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'parker', text: 'Hey, man! What\'s up, Mr Stark? 👋', time: 'Today at 11:41' },
    { sender: 'stark', text: 'Kid, where\'d you come from?', time: 'Today at 11:42' },
   ]);
  const [inputText, setInputText] = useState<string>(''); // inputText state type
  const [activeContact, setActiveContact] = useState<Contact | null>(null);


  // Fetch contacts from the API
  useEffect(() => {
    axios.get('http://localhost:8000/api/users') // Assuming your API endpoint is /api/user
      .then(response => {
        setContacts(response.data); // Assuming the response is an array of contacts
        console.log(response.data)
      })
      .catch(error => {
        console.error('There was an error fetching the contacts!', error);
      });
  }, []);

 

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([
        ...messages,
        { sender: 'parker', text: inputText, time: new Date().toLocaleString() }
      ]);
      setInputText('');
    }
  };
  const handleContactClick = (contact: Contact) => {
    setActiveContact(contact);
    setMessages([
      { sender: 'stark', text: `Send message to ${contact.username}`, time: new Date().toLocaleTimeString() }
    ]);
  };

  return (
    <Container>
      {/* Dynamic Contacts List */}
      <Contacts>
        <h2>Contacts</h2>
      <div>
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div
            key={contact.id}
            onClick={() => {
              console.log("hello");
              handleContactClick(contact); // Handle the contact click to set active contact
            }}
                          style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px',
                background: '#f4f4f4',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                position: 'relative', // For positioning the badge
              }}
            >
              {/* Profile Picture */}
              <div className="pic" style={{ marginRight: '15px' }}>
                <img
                  src={
                    contact.profile?.profile_image
                      ? `http://localhost:8000${contact.profile.profile_image}`
                      : 'https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/7/7c/Cap.America_%28We_Don%27t_Trade_Lives_Vision%29.png'
                  }
                  alt="Profile"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover', // Ensures the image fits well inside the circle
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#333',
                  }}
                >
                  {contact.username}
                </div>
                {contact.profile?.bio && ( // Using optional chaining to avoid accessing bio if profile is null
                  <div style={{ fontSize: '14px', color: '#555' }}>
                    {contact.profile.bio}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No contacts available.</div>
        )}
      </div>
      </Contacts>

      {/* Chat window */}
      {activeContact && (
        <Chat>
          <div className="contact bar">
            <h3>{activeContact.username}</h3>
          </div>

          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <p>{message.text}</p>
                <span className="time">{message.time}</span>
              </div>
            ))}
          </div>

          <InputContainer>
            <FaPaperPlane onClick={handleSendMessage} />
            <InputField
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
            />
          </InputContainer>
        </Chat>
      )}
    </Container>
  );
};

export default ChatApp;
