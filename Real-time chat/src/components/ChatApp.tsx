import  { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa'; // Optionally, use a react icon

const Container = styled.div`
  position: absolute;
  top: 60%;
  left: calc(50% + 12rem);
  transform: translate(-50%, -50%);
  display: flex;
  gap: 2rem;
`;

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

  .fa-bars {
    position: absolute;
    left: 2.25rem;
    color: #666;
    transition: color 200ms;
    &:hover {
      color: #999;
    }
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
      max-width: 66%;
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
// Container for the message input and send button
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

// Styled Input Field
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


const contactsData = [
  { id: 1, name: 'Steve Rogers', message: "That is America's ass 🇺🇸🍑", badge: 14, pic: 'https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/7/7c/Cap.America_%28We_Don%27t_Trade_Lives_Vision%29.png' },
  { id: 2, name: 'Tony Stark', message: 'Uh, he\'s from space, he came here to steal a necklace from a wizard.', badge: null, pic: 'https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/7/73/SMH_Mentor_6.png' },
  { id: 3, name: 'Bruce Banner', message: 'There\'s an Ant-Man *and* a Spider-Man?', badge: 1, pic: 'https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/4/4f/BruceHulk-Endgame-TravelingCapInPast.jpg' },
  { id: 4, name: 'Thor Odinson', message: 'I like this one', badge: 3, pic: 'https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/9/98/ThorFliesThroughTheAnus.jpg' },
  { id: 5, name: 'Carol Danvers', message: 'Hey Peter Parker, you got something for me?', badge: 2, pic: 'https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/0/05/HeyPeterParker.png' }
];

const ChatApp = () => {
  const [messages] = useState([
    { sender: 'parker', text: 'Hey, man! What\'s up, Mr Stark? 👋', time: 'Today at 11:41' },
    { sender: 'stark', text: 'Kid, where\'d you come from?', time: 'Today at 11:42' },
    { sender: 'parker', text: 'Field trip! 🤣', time: 'Today at 11:43' },
    { sender: 'parker', text: 'Uh, what is this guy\'s problem, Mr. Stark? 🤔', time: 'Today at 11:44' },
    { sender: 'stark', text: 'Uh, he\'s from space, he came here to steal a necklace from a wizard.', time: 'Today at 11:45' }
  ]);
  const [message, setMessage] = useState('');

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending the message here
      console.log('Sending message:', message);
      setMessage(''); // Clear the input field after sending
    }
  };
  return (
    <Container>
    
      <Contacts>
        <i className="fas fa-bars fa-2x"></i>
        <h2>Contacts</h2>
        {contactsData.map(contact => (
          <Contact key={contact.id}>
            <div className="pic" style={{ backgroundImage: `url(${contact.pic})` }}></div>
            {contact.badge && <div className="badge">{contact.badge}</div>}
            <div className="name">{contact.name}</div>
            <div className="message">{contact.message}</div>
            {contact.badge && <div className="seen">Seen</div>}
          </Contact>
        ))}
      </Contacts>

      <Chat>
        <div className="contact bar">
          <div className="pic" style={{ backgroundImage: `url(${contactsData[0].pic})` }}></div>
          <div className="name">{contactsData[0].name}</div>
        </div>

        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender === 'parker' ? 'parker' : ''}`}>
              {message.text}
              <div className="time">{message.time}</div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        <InputContainer>
      <InputField 
        type="text" 
        value={message}
        placeholder="Type your message..." 
        onChange={(e) => setMessage(e.target.value)} 
      />
<button className="btn btn-dark ms-2 rounded-3" onClick={handleSendMessage}>
  <FaPaperPlane size={20} />
</button>    </InputContainer>
      </Chat>
    </Container>
  );
};

export default ChatApp;
